from django.contrib import admin
from django.urls import path, include

import game.views as _v

urlpatterns = [
    path('', _v.landingView),
    path('information/', _v.informationView),
    path('consent/', _v.consentView),
    path('tutorial', _v.tutorialView),
    path('pointer/', _v.pointerView),
    path('end/', _v.debriefView),
]