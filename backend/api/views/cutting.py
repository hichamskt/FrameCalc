import os
import uuid
import json
from django.http import JsonResponse, FileResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from rectpack import newPacker
import svgwrite
import cairosvg

@csrf_exempt
def optimize_alucobond_cut(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        data = json.loads(request.body)
        print("Request data:", data)

        sheet_width = data.get('sheet_width', 3200)
        sheet_height = data.get('sheet_height', 1250)
        pieces = data['pieces']

        rectangles = []
        for item in pieces:
            rectangles.extend([(item['width'], item['height']) for _ in range(item['quantity'])])

        packer = newPacker(rotation=True)
        for r in rectangles:
            packer.add_rect(*r)
        packer.add_bin(sheet_width, sheet_height)
        packer.pack()

        packed = packer.rect_list()

        used_area = 0
        result_rects = []

        # Prepare media folder
        cutting_dir = os.path.join(settings.MEDIA_ROOT, 'cutting')
        os.makedirs(cutting_dir, exist_ok=True)

        filename = f"{uuid.uuid4()}.svg"
        output_path = os.path.join(cutting_dir, filename)

        dwg = svgwrite.Drawing(output_path, size=(sheet_width, sheet_height))
        dwg.add(dwg.rect(insert=(0, 0), size=(sheet_width, sheet_height), fill='white', stroke='black'))

        for _, x, y, w, h, _ in packed:
            dwg.add(dwg.rect(insert=(x, y), size=(w, h), fill='lightblue', stroke='blue'))
            dwg.add(dwg.text(f"{w}x{h}", insert=(x + 5, y + 20), fill='black', font_size='20px'))
            used_area += w * h
            result_rects.append({"x": x, "y": y, "width": w, "height": h})

        utilization = used_area / (sheet_width * sheet_height) * 100
        dwg.add(dwg.text(f'Utilization: {utilization:.2f}%', insert=(10, sheet_height - 10), fill='green', font_size='24px'))

        dwg.save()

        # Generate PDF from SVG
        pdf_filename = filename.replace('.svg', '.pdf')
        pdf_output_path = os.path.join(cutting_dir, pdf_filename)
        cairosvg.svg2pdf(url=output_path, write_to=pdf_output_path)

        base_url = request.build_absolute_uri('/').rstrip('/')

        return JsonResponse({
            "message": "Cutting layout generated",
            "utilization": round(utilization, 2),
            "cuts": result_rects,
            "svg_download_url": f"{base_url}/api/download/{filename}",
            "pdf_download_url": f"{base_url}/api/download/{pdf_filename}"
        })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def download_cut_file(request, filename):
    cutting_dir = os.path.join(settings.MEDIA_ROOT, 'cutting')
    file_path = os.path.join(cutting_dir, filename)

    if os.path.exists(file_path):
        return FileResponse(open(file_path, 'rb'), as_attachment=True, filename=filename)
    else:
        raise Http404("File not found")
