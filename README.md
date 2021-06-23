# Fontilizer
Javascript Framework
by Julian Ismael Berger

This project is in progress. You can use Fontilizer to manipulate DOM easyily. The main puprose is changing text in various ways. You can set the font-family of html nodes randomly or set them to uppercase randomly. You can repeat these actions as interval and many more.

## Install Guide
Include JS file in HTML file

End of BODY tag
<script src="[PATH_TO_FILE]/fontilizer.js"></script>

Inside HEADER tag
<script defer src="[PATH_TO_FILE]/fontilizer.js"></script>


## Usage
Select node(s) by selector
Fontilizer(".class")
F$("#id")

Set a random font-family for node(s), pass an array of font type names (fontTypes) that are included in your html file or local fonts
Fontilizer(".random-font-family").randomFontType(fontTypes);
F$(".random-font-family").randomFontType(fontTypes);

Repeat changing font-family by interval
F$(".random-font-family-repeat").repeatRandomFontType(fontTypes, {
delay: 500,
});


## Demo
<a href="index.html">Demofile</a><br/>
<a target="_blank" href="https://www.julianberger.de/coding/fontilizer/">Watch live</a>


## Documentation
coming soon ...

## Changelog
23.06.2021
Publish first dev version