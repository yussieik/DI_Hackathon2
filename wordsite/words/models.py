from django.db import models
from django.contrib.auth import get_user_model
# Create your models here.

User = get_user_model()

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return self.user.username


class Word(models.Model):

#    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
   word = models.CharField(max_length=15)
   definition = models.TextField(max_length=220, blank=True, null=True )
   isLearning = models.BooleanField(default=True)
   story = models.BooleanField(default=False)
   updated = models.DateTimeField(auto_now=True)


   def __str__(self) -> str:
       return self.word

class StoryAi(models.Model):

   word = models.ForeignKey(Word, on_delete=models.CASCADE)
   story = models.TextField(max_length=650, blank=True, null=True )

   def __str__(self) -> str:
       return str(self.word)
