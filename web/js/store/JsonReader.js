(function() {
    var my = by8.extend('by8.store.JsonReader', Object, {
        /*
         * Expected data format:
         * {
         *     key1: <property>,
         *     key2: <property>
         * }
         * 
         * @return The data as a single-element array
         */
        read: function(data) {
            if (data) {
                return [data];
            }
        }
    });
})();