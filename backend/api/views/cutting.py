from django.http import JsonResponse, FileResponse
from django.views.decorators.csrf import csrf_exempt
import json
import os
import uuid
from rectpack import newPacker
import svgwrite
from django.conf import settings

@csrf_exempt
def optimize_alucobond_cut(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        data = json.loads(request.body)

        # Input sheet size and pieces
        sheet_width = data.get('sheet_width', 3200)
        sheet_height = data.get('sheet_height', 1250)
        pieces = data['pieces']  # Format: [{ "width": 500, "height": 300, "quantity": 4 }, ...]

        rectangles = []
        for item in pieces:
            rectangles.extend([(item['width'], item['height']) for _ in range(item['quantity'])])

        # Use rectpack
        packer = newPacker(rotation=True)
        for r in rectangles:
            packer.add_rect(*r)
        packer.add_bin(sheet_width, sheet_height)
        packer.pack()
        packed = packer.rect_list()

        # Create SVG
        filename = f"{uuid.uuid4()}.svg"
        cutting_dir = os.path.join(settings.MEDIA_ROOT, 'cutting')
        os.makedirs(cutting_dir, exist_ok=True)
        output_path = os.path.join(cutting_dir, filename)     
        dwg = svgwrite.Drawing(output_path, size=(sheet_width, sheet_height))
        dwg.add(dwg.rect(insert=(0, 0), size=(sheet_width, sheet_height), fill='white', stroke='black'))

        used_area = 0
        result_rects = []
        for _, x, y, w, h, _ in packed:
            dwg.add(dwg.rect(insert=(x, y), size=(w, h), fill='lightblue', stroke='blue'))
            dwg.add(dwg.text(f"{w}x{h}", insert=(x + 5, y + 20), fill='black', font_size='20px'))
            used_area += w * h
            result_rects.append({"x": x, "y": y, "width": w, "height": h})

        utilization = used_area / (sheet_width * sheet_height) * 100
        dwg.add(dwg.text(f'Utilization: {utilization:.2f}%', insert=(10, sheet_height - 10), fill='green', font_size='24px'))
        dwg.save()

        return JsonResponse({
            "message": "Cutting layout generated",
            "utilization": round(utilization, 2),
            "cuts": result_rects,
            "svg_file_url": f"{settings.MEDIA_URL}cutting/{filename}"
        })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
