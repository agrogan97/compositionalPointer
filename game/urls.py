from django.contrib import admin
from django.urls import path, include

import game.views as _v

urlpatterns = [
    path('', _v.landingView),
    path('information/', _v.informationView),
    path('consent/', _v.consentView),
    path('tutorial/', _v.tutorialView),
    path('pointer/', _v.pointerView),
    path('debrief/', _v.debriefView),
    path('pointer/api/save/', _v.save),
    path('pointer/api/submitDebrief/', _v.submitDebrief),
]