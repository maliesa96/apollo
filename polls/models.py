from django.db import models
from django.conf import settings
from django.contrib.sessions.models import Session

class Room(models.Model):
    roomid = models.CharField("Room ID",max_length=10, blank=False)
    anonymous = models.BooleanField("anonymous")
    private = models.BooleanField("private")
    key = models.CharField(max_length=16)

    def __str__(self):
        return self.roomid

class Participant(models.Model):
    name = models.CharField("name", max_length=100, blank=False)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    session = models.ForeignKey(Session, null=True, on_delete=models.CASCADE)
    present = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Poll(models.Model):

    title = models.CharField("title",max_length=100, blank=False)
    pub_date = models.DateTimeField("Date Created",auto_now_add=True)
    type = models.CharField("Type", max_length=20)
    active = models.BooleanField(default=True)
    avgVote = models.DecimalField(max_digits=3,decimal_places=2,null=True)
    voteCount = models.IntegerField(null=True)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)


    def __str__(self):
        return self.title

class Option(models.Model):
    option = models.CharField("option", max_length=200, blank=True, default=None)
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE)

    def __str__(self):
        return self.option

class NumberedOption(models.Model):
    start = models.FloatField()
    end = models.FloatField()
    poll = models.ForeignKey(Poll,on_delete=models.CASCADE)

    def __str__(self):
        return str(self.start+"-"+self.end)


class NumberedVote(models.Model):
    vote = models.FloatField()
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE)
    session = models.ForeignKey(Session, null=True, on_delete=models.SET_NULL)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.vote)

class YesNoVote(models.Model):
    vote = models.CharField(max_length=5, null=False)
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE)
    session = models.ForeignKey(Session, null=True, on_delete=models.SET_NULL)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, on_delete=models.CASCADE)

    def __str__(self):
        return self.vote

class MCVote(models.Model):
    vote = models.ForeignKey(Option, on_delete=models.CASCADE)
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE)
    session = models.ForeignKey(Session, null=True, on_delete=models.SET_NULL)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, on_delete=models.CASCADE)

    def __str__(self):
        return self.vote.option

# Create your models here.
