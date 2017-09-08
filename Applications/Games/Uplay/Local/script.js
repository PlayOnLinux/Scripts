include(["Engines", "Wine", "QuickScript", "LocalInstallerScript"]);

new LocalInstallerScript()
    .name("Uplay")
    .editor("Ubisoft")
    .applicationHomepage("https://uplay.ubi.com/")
    .author("Plata")
    .category("Games")
    .executable("UbisoftGameLauncher.exe")
    .wineVersion("2.16")
    .wineDistribution("staging")
    .go();
