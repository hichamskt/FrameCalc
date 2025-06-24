# views.py
from rest_framework import generics
from ..models import Sketch
from ..serializers.Sketch import SketchSerializer
from rest_framework.permissions import IsAuthenticated

class SketchListCreateView(generics.ListCreateAPIView):
    serializer_class = SketchSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Sketch.objects.filter(user=self.request.user).select_related('user')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

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