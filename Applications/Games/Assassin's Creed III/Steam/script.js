include(["Engines", "Wine", "QuickScript", "SteamScript"]);
include(["Engines", "Wine", "Verbs", "uplay"]);

new SteamScript()
    .name("Assassin’s Creed® III")
    .editor("Ubisoft Montreal")
    .author("Plata")
    .appId(208480)
    .wineVersion("2.14")
    .wineDistribution("staging")
    .preInstall(function (wine, wizard) {
        wine.windowsVersion("win7");
    })
    .go();
