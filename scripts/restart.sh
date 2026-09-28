#!/bin/bash

#Use this script to reload the script quickly when developing

qdbus org.kde.KWin /Scripting org.kde.kwin.Scripting.unloadScript KSlide
npm run compile
npm run install

qdbus org.kde.KWin /Scripting org.kde.kwin.Scripting.start 



