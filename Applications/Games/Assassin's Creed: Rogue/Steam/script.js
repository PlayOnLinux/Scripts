include("engines.wine.quick_script.steam_script");
include("engines.wine.verbs.uplay");

var installerImplementation = {
    run: function () {
        new SteamScript()
            .name("Assassin’s Creed® Rogue")
            .editor("Ubisoft")
            .author("KREYREN")
            .appId(311560)
            .wineVersion(LATEST_STAGING_VERSION)
            .wineDistribution("staging")
            .postInstall(function (wine/*, wizard*/) {
                wine.uplay();
            })
            .go();
    }
};

/* exported Installer */
var Installer = Java.extend(org.phoenicis.scripts.Installer, installerImplementation);
