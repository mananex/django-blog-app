from django.db import models

# Create your models here.
class Profile(models.Model):
    username        = models.CharField(max_length = 30, unique = True)
    password        = models.TextField()
    password_salt   = models.CharField(max_length = 4)
    auth_token      = models.TextField()
    
    def __str__(self):
        return f'Name: {self.username}, ID: {self.id}'