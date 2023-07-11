"""
URL configuration for wordsite project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from words.views import (   WordListView, 
                            WordDetailView, 
                            WordIDListAPIView, 
                            WordSearchAPIView, 
                            WordCreateView, 
                            WordforStoryIDListAPIView,
                            get_story_by_word_id,
                            
                            home, 
                            newword, 
                            mix_game,
                            text_game,)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('api/words/', WordListView.as_view(), name = 'words'),
    path('api/words/<int:pk>/', WordDetailView.as_view(), name = 'word-details' ),
    path('api/word-ids/', WordIDListAPIView.as_view(), name='word-id-list'),
    path('api/word-search/', WordSearchAPIView.as_view(), name='word-search'),
    path('create/', WordCreateView.as_view(), name = 'word-create'),
    path('api/words-story-ids/', WordforStoryIDListAPIView.as_view(), name = 'word-id-for-story' ),
    path('api/word/<int:word_id>/story/', get_story_by_word_id, name='get_story_by_word_id'),
    path('home', home, name='home'), # for test
    path('newword', newword, name='newword'), # for test
    path('mix_game', mix_game, name='mix_game'), # for test
    path('text_game', text_game, name='text_game'), # for test
    
   
]

if settings.DEBUG:
   urlpatterns += static(settings.STATIC_URL, document_root = settings.STATIC_ROOT)