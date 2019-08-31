const SteamScript = include("engines.wine.quick_script.steam_script");
const {LATEST_STAGING_VERSION} = include("engines.wine.engine.versions");

const Corefonts = include("engines.wine.verbs.corefonts");
const D3DX9 = include("engines.wine.verbs.d3dx9");
include("engines.wine.verbs.tahoma");
include("engines.wine.verbs.vcrun2005");
include("engines.wine.verbs.vcrun2008");

new SteamScript()
    .name("Warlock - Master of the Arcane")
    .editor("Paradox Interactive")
    .author("madoar")
    .appId(203630)
    .wineVersion(LATEST_STAGING_VERSION)
    .wineDistribution("staging")
    .preInstall(function (wine /*, wizard*/) {
        new Corefonts(wine).go();
        new D3DX9(wine).go();
        wine.tahoma();
        wine.vcrun2005();
        wine.vcrun2008();
    });
