from django.shortcuts import render
from .models import Word, UserProfile, StoryAi
from .serializers import WordSerializer, WordCreateSerializer, StorySerializer
from rest_framework import generics

from rest_framework import permissions
from rest_framework.permissions import (AllowAny, IsAuthenticated)
from rest_framework.generics import (ListAPIView, CreateAPIView)
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

# Create your views here.
def home(request):
   return render(request, 'index.html') 

def newword(request):
   return render(request, 'newword.html')

def mix_game(request):
   return render(request, 'mix_game.html')

def text_game(request):
   return render(request, 'text_game.html')

class WordListView(generics.ListCreateAPIView):
    queryset = Word.objects.all()
    serializer_class = WordSerializer
    permission_classes = (AllowAny, ) 
    

class WordDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Word.objects.all()
    serializer_class = WordSerializer
    permission_classes = (AllowAny, )  
    
# recive id list

# story for test
class WordforStoryIDListAPIView(generics.ListAPIView):
    queryset = Word.objects.filter(story=True)  # filter 'isLearning' value
    serializer_class = WordSerializer
    permission_classes = (AllowAny, )  

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        word_ids = queryset.values_list('id', flat=True) 
        return Response(word_ids)



class WordIDListAPIView(generics.ListAPIView):
    queryset = Word.objects.filter(isLearning=True)  # filter 'isLearning' value
    serializer_class = WordSerializer
    permission_classes = (AllowAny, )  

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        word_ids = queryset.values_list('id', flat=True) 
        return Response(word_ids)

#id to test Story
@api_view(['GET'])
def get_story_by_word_id(request, word_id):
    try:
        word = Word.objects.get(id=word_id)
        if word.story:
            story = word.storyai_set.first().story
            return Response({'story': story}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'No story found for the word ID.'}, status=status.HTTP_404_NOT_FOUND)
    except Word.DoesNotExist:
        return Response({'message': 'Word not found.'}, status=status.HTTP_404_NOT_FOUND)
# search

class WordSearchAPIView(generics.ListAPIView):
    queryset = Word.objects.all()
    serializer_class = WordSerializer
    permission_classes = (AllowAny, )  

    def get(self, request, *args, **kwargs):
        search_word = request.GET.get('word', '')  # /api/word-search/?word=... search by request query parameters
        queryset = self.get_queryset().filter(word__icontains=search_word)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
#test
class WordCreateView(CreateAPIView):
   queryset = Word.objects.all()
   serializer_class = WordCreateSerializer
   permission_classes = (AllowAny, ) 
