from rest_framework import serializers
from .models import Word, StoryAi

class WordSerializer(serializers.ModelSerializer):

    class Meta:
        model = Word
        fields = (
           'id',
           'word',
           'definition',
           'isLearning',
           'updated',
           )

class WordCreateSerializer(serializers.ModelSerializer):


   class Meta:
       model = Word
       fields = (
           'word',
           'definition',
           'isLearning',
           )
       
class StorySerializer(serializers.ModelSerializer):

    class Meta:
        model = StoryAi
        fields = (
           'id',
           'word',
           'story',
            )

# class UserProfileSerializer(serializers.ModelSerializer):


#     class Meta:
#         model = UserProfile
#         fields = ('id', 'user', )