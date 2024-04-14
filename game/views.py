from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework.parsers import JSONParser
from game.models import RoundData, DebriefForm
from game.serializers import RoundDataSerializer, DebriefFormSerializer
from django.views.decorators.csrf import csrf_exempt

def landingView(request):

    return render(request, "landing.html", {})

def informationView(request):

    return render(request, "information.html", {})

def consentView(request):

    return render(request, "consent.html", {})

def tutorialView(request):

    return render(request, "tutorial.html", {})

def pointerView(request):

    return render(request, "pointer.html", {})

def debriefView(request):

    print("Loading debrief")
    print(request)

    return render(request, "debrief.html", {})

## --- API --- ##

@csrf_exempt
def save(request):
    if request.method == "POST":
        data = JSONParser().parse(request)
        serializer = RoundDataSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return HttpResponse(status=200)
        else:
            print("Got bad request", serializer)
            return HttpResponse(status=400) # bad request
    return HttpResponse(status=400)

@csrf_exempt
def submitDebrief(request):
    if request.method == "POST":
        data = JSONParser().parse(request)
        serializer = DebriefFormSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return HttpResponse(status=200)
        else:
            print("Got bad request", serializer)
            return HttpResponse(status=400)
    return HttpResponse(status=400)