from django.contrib import admin
from .models import Word, StoryAi

# Register your models here.

admin.site.register(StoryAi)
admin.site.register(Word)