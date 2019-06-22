include("engines.wine.engine.object");

/**
 * Tool to repair a Wine prefix
 */
class RepairWinePrefixTool {
    constructor() {
        // do nothing
    }

    run(container) {
        new Wine()
            .prefix(container)
            .run("wineboot", [], null, false, true);
    }
}
