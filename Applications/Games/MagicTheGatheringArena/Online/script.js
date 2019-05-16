include("engines.wine.quick_script.custom_installer_script");
include("engines.wine.verbs.dxvk");
include("engines.wine.plugins.UseTakeFocus")

// Installs Magic: The Gathering Arena
/// RELEVANT: https://github.com/PhoenicisOrg/scripts/issues/934

var installerImplementation = {
    run: function () {
        new OnlineInstallerScript()
            .name("Magic: The Gathering Arena")
            .applicationHomepage("https://magic.wizards.com/")
            .url("https://mtgarena.downloads.wizards.com/Live/Windows32/MTGAInstaller.exe")
            .author("KREYREN")
            .category("Games")
            .wineDistribution("staging")
            .wineVersion(LATEST_STAGING_VERSION)
            .preInstall(function (wine, wizard) {
                wine.dxvk();
                wine.UseTakeFocus("Disabled");
            })
            .executable("MTGAInstaller.exe")
            .go();
    }
};

/* exported Installer */
var Installer = Java.extend(org.phoenicis.scripts.Installer, installerImplementation);
