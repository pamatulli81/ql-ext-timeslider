define(function () {

  var about = {
    type: "items",
    label: "About",
    items: {
      about1: {
        type: "string",
        component: "text",
        label: "Patric Amatulli 2018"
      },
      about1a: {
        type: "string",
        component: "text",
        label: "BETA: v0.1.0" 
      },
      about2: {
        type: "string",
        component: "text",
        label: "GitHub: www.github.com/pamaxeed"
      },
      about3: {
        type: "string",
        component: "text",
        label: "Timeline Extensions with animated feature which triggers selection on the defined field!"
      }
    }
  };

  return {
    initialProperties: {
      qListObjectDef: {
        qShowAlternatives: true,
        qFrequencyMode: "V",
        qInitialDataFetch: [{
          qWidth: 1,
          qHeight: 1000
        }]
      }
    },
    definition: {
      type: "items",
      component: "accordion",
      items: {
        dimension: {
          type: "items",
          label: "Timeline Field",
          ref: "qListObjectDef",
          min: 1,
          max: 1,
          items: {
            label: {
              type: "string",
              ref: "qListObjectDef.qDef.qFieldLabels.0",
              label: "Label",
              show: true
            },
            field: {
              type: "string",
              expression: "always",
              expressionType: "dimension",
              ref: "qListObjectDef.qDef.qFieldDefs.0",
              label: "Field",
              show: function (data) {
                return data.qListObjectDef && !data.qListObjectDef.qLibraryId;
              }
            },
            interval: {
              type: "integer",
              expression: "optional",
              ref: "qSlider.qInterval",
              label: "Interval",
              defaultValue: 1000
            },
            step: {
              type: "integer",
              expression: "optional",
              ref: "qSlider.qStaticStep",
              label: "Static step",
              defaultValue: 1
            }
          }
        },
        about
      }
    },
    snapshot: {
      canTakeSnapshot: true
    }
  };
});
