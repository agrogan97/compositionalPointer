from django.shortcuts import render

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

    return render(request, "debrief.html", {})