from rest_framework import serializers
from ..models import ( AluminumRequirementItem)


class AluminumRequirementItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = AluminumRequirementItem
        fields = '__all__'
        extra_kwargs = {
            'profile_material': {
                'error_messages': {
                    'does_not_exist': 'Profile material does not exist'
                }
            }
        }

    def validate(self, data):
        # Check for existing material in requirement
        if AluminumRequirementItem.objects.filter(
            requirement=data['requirement'],
            profile_material=data['profile_material']
        ).exists():
            raise serializers.ValidationError({
                'profile_material': 'This material already exists for the requirement'
            })
        return data