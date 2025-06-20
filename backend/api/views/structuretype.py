from rest_framework import generics
from ..models import StructureType
from ..serializers.serializers import StructureTypeSerializer

class StructureTypeListView(generics.ListCreateAPIView):
  
    queryset = StructureType.objects.all().order_by('name')
    serializer_class = StructureTypeSerializer
    permission_classes = []  

class StructureTypeDetailView(generics.RetrieveUpdateDestroyAPIView):
   
    queryset = StructureType.objects.all()
    serializer_class = StructureTypeSerializer
    permission_classes = []
    lookup_field = 'type_id'

