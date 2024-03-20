from django.db import models

"""
Our save data here is:
    - id :: str - user ID
    - roundIndex :: int - specific round ID
    - curriculumType :: str - identifier of which type of curriculum this is
    - mapping :: json - maps the concept type (A, B, C, D) to the img number (1, 5, 3, 6, etc.)
    - source :: str - the player's source, eg. debug, prolific, etc.
    - functions :: str - a stringified list of the funtion types, eg. "ABCD"
    - score :: int - the end score
    - start :: int - the start score
    - target :: int - the target score
    - starttime :: int - round start time as epoch
    - endtime :: int - round end time as epoch
"""

class RoundData(models.Model):
    class Meta:
        verbose_name = "Round Data"
        verbose_name_plural = "Round Data"
    
    playerId = models.CharField(max_length=64)
    roundIndex = models.IntegerField()
    curriculumType = models.CharField(max_length=32)
    mapping = models.CharField(max_length=128)
    source = models.CharField(max_length=32)
    start = models.IntegerField()
    score = models.IntegerField()
    target = models.IntegerField()
    starttime = models.CharField(max_length=64)
    endtime = models.CharField(max_length=64)
    timeCreated = models.DateTimeField(auto_now_add=True)
    functions = models.CharField(max_length=32)