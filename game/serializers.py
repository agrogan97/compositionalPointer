from rest_framework import serializers
from game.models import RoundData, DebriefForm

class RoundDataSerializer(serializers.Serializer):
    playerId = serializers.CharField(required=True, max_length=64)
    roundIndex = serializers.IntegerField(required=True)
    curriculumType = serializers.CharField(required=True, max_length=32)
    mapping = serializers.CharField(required=True, max_length=128)
    source = serializers.CharField(required=True, max_length=32)
    start = serializers.IntegerField(required=True)
    score = serializers.IntegerField(required=True)
    target = serializers.IntegerField(required=True)
    starttime = serializers.CharField(required=True, max_length=64)
    endtime = serializers.CharField(required=True, max_length=64)
    timeCreated = serializers.DateTimeField(required=False)
    functions = serializers.CharField(required=True)

    def create(self, validated_data):
        # Create and return a new model instance using the validated data
        # print(validated_data)
        return RoundData.objects.create(**validated_data)

class DebriefFormSerializer(serializers.Serializer):
    playerId = serializers.CharField(required=True, max_length=64)
    timeCreated = serializers.DateTimeField(required=False)
    responses = serializers.CharField(required=True, max_length=5120)
    questions = serializers.CharField(required=True, max_length=5120)

    def create(self, validated_data):
        return DebriefForm.objects.create(**validated_data)