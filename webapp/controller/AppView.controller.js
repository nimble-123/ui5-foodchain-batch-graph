sap.ui.define(['sap/ui/core/mvc/Controller', 'sap/ui/model/json/JSONModel'], function(Controller, JSONModel) {
    'use strict';

    return Controller.extend('io.dev.foodchain.ui5-producer-app.controller.AppView', {
        onInit: function() {
            var that = this;
            var oModel = new JSONModel();
            var aNodesArray = [];
            var aLinesArray = [];
            // get BatchNetwork with id 1
            $.ajax({
                url: 'http://localhost:3000/api/BatchNetwork/1',
                dataType: 'JSON',
                async: false,
            }).done(function(oBatchNetwork) {
                // iterate over all Batch nodes and request detail information from REST API
                oBatchNetwork.nodes.forEach(oBatch => {
                    $.ajax({
                        url: 'http://localhost:3000/api/Batch/' + oBatch.split('#').pop(),
                        dataType: 'JSON',
                        async: false,
                    }).done(function(oBatch) {
                        // transform requested data to fit UI5 control model
                        aNodesArray.push({
                            key: oBatch.batchId,
                            title: 'Batch_' + oBatch.batchId,
                            icon: 'sap-icon://database',
                            status: Number(oBatch.batchId) < 3 ? 'Warning' : 'Success',
                            group: Number(oBatch.batchId) < 3 ? 'F' : 'S',
                            shape: 'Box',
                            maxWidth: 600,
                            attributes: [
                                {
                                    label: 'Description',
                                    value: oBatch.description,
                                },
                                {
                                    label: 'Datum',
                                    value: new Date(oBatch.timestamp).toISOString().split('T')[0],
                                },
                                {
                                    label: 'Material Count',
                                    value: oBatch.availableMaterialCount,
                                },
                            ],
                        });
                        // iterate over all Material nodes and request detail information from REST API
                        oBatch.materials.forEach(oMaterial => {
                            $.ajax({
                                url: 'http://localhost:3000/api/Material/' + oMaterial.split('#').pop(),
                                dataType: 'JSON',
                                async: false,
                            }).done(function(oMaterial) {
                                // transform requested data to fit UI5 control model
                                aNodesArray.push({
                                    key: oMaterial.materialId,
                                    title:
                                        'Material ' +
                                        oMaterial.materialId
                                            .split('#')
                                            .pop()
                                            .split('_')
                                            .pop(),
                                    icon: 'sap-icon://product',
                                    status: Number(oBatch.batchId) < 3 ? 'Error' : 'Success',
                                    group: Number(oBatch.batchId) < 3 ? 'F' : 'S',
                                });
                                // add line between Material and corresponding Batch
                                aLinesArray.push({
                                    from: oMaterial.materialId,
                                    to: oBatch.batchId,
                                });
                            });
                        });
                        if (oBatch.batchId <= 3) {
                            aLinesArray.push({
                                from: oBatch.batchId,
                                to: '3',
                            });
                        }
                        if (oBatch.batchId > 3) {
                            aLinesArray.push({
                                from: '3',
                                to: oBatch.batchId,
                            });
                        }
                    });
                });
            });

            oModel.setProperty('/nodes', aNodesArray);
            oModel.setProperty('/lines', aLinesArray);
            oModel.setProperty('/groups', [
                {
                    key: 'F',
                    title: 'Farmer',
                    icon: 'sap-icon://factory',
                },
                {
                    key: 'S',
                    title: 'Slaughterhouse',
                    icon: 'sap-icon://building',
                },
                {
                    key: 'C',
                    title: 'Cutting Plant',
                    icon: 'sap-icon://building',
                },
            ]);
            oModel.setProperty('/nodeBoxWidth', 200);
            this.getView().setModel(oModel);

            this._oModelSettings = new JSONModel({
                source: 'atomicCircle',
                orientation: 'LeftRight',
                arrowPosition: 'End',
                arrowOrientation: 'ParentOf',
                nodeSpacing: 55,
                mergeEdges: true,
            });

            this.getView().setModel(this._oModelSettings, 'settings');
        },

        onAfterRendering: function() {
            this.byId('graphWrapper')
                .$()
                .css('overflow-y', 'auto');
        },

        mergeChanged: function(oEvent) {
            this._oModelSettings.setProperty('/mergeEdges', !!Number(oEvent.getSource().getProperty('selectedKey')));
        },

        spacingChanged: function(oEvent) {
            this._oModelSettings.setProperty('/nodeSpacing', Number(oEvent.getSource().getProperty('selectedKey')));
        },
    });
});
