# views.py

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from ..models import Sketch
from ..serializers.Sketch import SketchSerializer
from ..utils.yolo_number_detector import detect_shapes_and_numbers_yolo
from decimal import Decimal


class SketchListCreateView(generics.ListCreateAPIView):
    serializer_class = SketchSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Sketch.objects.filter(user=self.request.user).select_related('user')

    def perform_create(self, serializer):
        # Extract image from the validated data
        image = serializer.validated_data.get('image')

        # Default width/height
        width, height = Decimal(0), Decimal(0)

        if image:
            # Save a temp Sketch just to access image path (MUST include dummy width/height)
            temp_sketch = Sketch(
                user=self.request.user,
                image=image,
                width=width,
                height=height,
                shape="rectangle"
            )
            temp_sketch.save()

            # Now detect dimensions using YOLO
            result = detect_shapes_and_numbers_yolo(temp_sketch.image.path)
            if result:
                width_value = result.get("width")
                height_value = result.get("height")

                width = Decimal(width_value) if width_value is not None else Decimal(0)
                height = Decimal(height_value) if height_value is not None else Decimal(0)
            else:
                width = Decimal(0)
                height = Decimal(0)

        # Final save with all correct values
        serializer.save(
            user=self.request.user,
            width=width,
            height=height,
            shape="rectangle"
        )



class SketchDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SketchSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'sketch_id'

    def get_queryset(self):
        return Sketch.objects.filter(user=self.request.user)


class UserSketchesView(generics.ListAPIView):
    serializer_class = SketchSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Sketch.objects.filter(user_id=user_id).select_related('user')
