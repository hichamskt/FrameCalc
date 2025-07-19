from rectpack import newPacker
import io
import base64
import matplotlib.pyplot as plt
import matplotlib.patches as patches

def optimize_cut(sheet_width, sheet_height, pieces):
    packer = newPacker(rotation=True)
    packer.add_bin(sheet_width, sheet_height)

    for w, h, qty in pieces:
        for _ in range(qty):
            packer.add_rect(w, h)

    packer.pack()

    used_area = 0
    placements = []

    for rect in packer.rect_list():
        b, x, y, w, h, rid = rect
        placements.append({'x': x, 'y': y, 'width': w, 'height': h})
        used_area += w * h

    total_area = sheet_width * sheet_height
    efficiency = round((used_area / total_area) * 100, 2)
    unused_area = total_area - used_area

    # Generate layout image
    img_base64 = generate_layout_image(sheet_width, sheet_height, placements, efficiency)

    return {
        'placements': placements,
        'used_area': used_area,
        'unused_area': unused_area,
        'efficiency': efficiency,
        'image': img_base64
    }

def generate_layout_image(sheet_w, sheet_h, placements, efficiency):
    fig, ax = plt.subplots()
    ax.set_xlim(0, sheet_w)
    ax.set_ylim(0, sheet_h)
    ax.set_aspect('equal')

    for rect in placements:
        x, y, w, h = rect['x'], rect['y'], rect['width'], rect['height']
        ax.add_patch(patches.Rectangle((x, y), w, h, edgecolor='black', facecolor='skyblue', linewidth=1))

    ax.set_title(f"Layout Efficiency: {efficiency}%")
    plt.gca().invert_yaxis()
    plt.axis('off')
    buf = io.BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight')
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read()).decode('utf-8')
    plt.close(fig)
    return img_base64
