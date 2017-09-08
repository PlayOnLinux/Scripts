include(["Engines", "Wine", "QuickScript", "SteamScript"]);
include(["Engines", "Wine", "Verbs", "uplay"]);

new SteamScript()
    .name("Assassin’s Creed® Brotherhood")
    .editor("Ubisoft")
    .author("Plata")
    .appId(48190)
    .wineVersion("2.16")
    .wineDistribution("staging")
    .postInstall(function(wine, wizard) {
        wine.uplay();
    })
    .go();
