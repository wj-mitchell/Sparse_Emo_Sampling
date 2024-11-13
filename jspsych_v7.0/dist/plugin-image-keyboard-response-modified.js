var jsPsychImageKeyboardResponseModified = (function (jspsych) {
    'use strict';
  
    var _package = {
      name: "@jspsych/plugin-image-keyboard-response-modified",
      version: "2.0.0",
      description: "jsPsych plugin for displaying a stimulus and getting a keyboard response",
      type: "module",
      main: "dist/index.cjs",
      exports: {
        import: "./dist/index.js",
        require: "./dist/index.cjs"
      },
      typings: "dist/index.d.ts",
      unpkg: "dist/index.browser.min.js",
      files: [
        "src",
        "dist"
      ],
      source: "src/index.ts",
      scripts: {
        test: "jest",
        "test:watch": "npm test -- --watch",
        tsc: "tsc",
        build: "rollup --config",
        "build:watch": "npm run build -- --watch"
      },
      repository: {
        type: "git",
        url: "git+https://github.com/jspsych/jsPsych.git",
        directory: "packages/plugin-image-keyboard-response-modified"
      },
      author: "Josh de Leeuw",
      license: "MIT",
      bugs: {
        url: "https://github.com/jspsych/jsPsych/issues"
      },
      homepage: "https://www.jspsych.org/latest/plugins/image-keyboard-response-modified",
      peerDependencies: {
        jspsych: ">=7.1.0"
      },
      devDependencies: {
        "@jspsych/config": "^3.0.0",
        "@jspsych/test-utils": "^1.2.0"
      }
    };
  
    const info = {
      name: "image-keyboard-response-modified",
      version: _package.version,
      parameters: {
        stimulus: {
          type: jspsych.ParameterType.IMAGE,
          array: true,
          default: undefined
        },
        stimulus_caption: {
          type: jspsych.ParameterType.STRING,
          array: true,
          default: [null]
        },
        stimulus_height: {
          type: jspsych.ParameterType.INT,
          default: null
        },
        stimulus_width: {
          type: jspsych.ParameterType.INT,
          default: null
        },
        maintain_aspect_ratio: {
          type: jspsych.ParameterType.BOOL,
          default: true
        },
        choices: {
          type: jspsych.ParameterType.KEYS,
          default: "ALL_KEYS"
        },
        prompt: {
          type: jspsych.ParameterType.HTML_STRING,
          default: null
        },
        stimulus_duration: {
          type: jspsych.ParameterType.INT,
          default: null
        },
        trial_duration: {
          type: jspsych.ParameterType.INT,
          default: null
        },
        response_ends_trial: {
          type: jspsych.ParameterType.BOOL,
          default: true
        },
        render_on_canvas: {
          type: jspsych.ParameterType.BOOL,
          default: true
        }
      },
      data: {
        stimulus: {
          type: jspsych.ParameterType.STRING
        },
        response: {
          type: jspsych.ParameterType.STRING
        },
        rt: {
          type: jspsych.ParameterType.INT
        }
      }
    };
  
    class ImageKeyboardResponseModifiedPlugin {
      constructor(jsPsych) {
        this.jsPsych = jsPsych;
      }
      static info = info;
      trial(display_element, trial) {
        var height, width;
          if (trial.render_on_canvas) {
            if (display_element.hasChildNodes()) {
              while (display_element.firstChild) {
                display_element.removeChild(display_element.firstChild);
              }
            }
            var canvas = document.createElement("canvas");
            canvas.id = "jspsych-image-keyboard-response-modified-stimulus";
            canvas.style.margin = "0";
            canvas.style.padding = "0";
            var ctx = canvas.getContext("2d");
          
            var images = trial.stimulus.map(src => {
              var img = new Image();
              img.src = src;
              return img;
            });
          
            Promise.all(images.map(img => new Promise(resolve => img.onload = resolve)))
              .then(() => {
                var totalWidth = images.reduce((sum, img) => sum + trial.stimulus_width, 0);  // Use trial.stimulus_width for total width calculation
                var maxHeight = trial.stimulus_height;  // Use trial.stimulus_height for max height
                var maxPadding = (window.innerWidth - totalWidth) / (images.length * 2);
          
                canvas.width = totalWidth + maxPadding * 2 * images.length;
                canvas.height = maxHeight + 50;  // Add extra height for captions
          
                var x = maxPadding;
                images.forEach((img, index) => {
                  ctx.drawImage(img, x, 0, trial.stimulus_width, trial.stimulus_height);  // Resize images to the specified dimensions
                  if (trial.stimulus_caption && trial.stimulus_caption[index]) {
                    ctx.font = '16px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(trial.stimulus_caption[index], x + trial.stimulus_width / 2, trial.stimulus_height + 20); // Position text below the image
                  }
                  x += trial.stimulus_width + maxPadding * 2;
                });
          
                display_element.insertBefore(canvas, null);
              });
          
            if (trial.prompt !== null) {
              display_element.insertAdjacentHTML("beforeend", '<div class="jspsych-prompt">' + trial.prompt + '</div>');
            }
          } else{
          var html = '<div class="jspsych-image-keyboard-response-modified-stimulus">';
          trial.stimulus.forEach(function(stimulus, index) {
            html += '<div style="display: inline-block; text-align: center; margin: 0 10px;">';
            html += '<img src="' + stimulus + '" class="jspsych-image-keyboard-response-modified-stimulus" style="display: block;">';
            if (trial.stimulus_caption && trial.stimulus_caption[index]) {
              html += '<div>' + trial.stimulus_caption[index] + '</div>';
            }
            html += '</div>';
          });
          html += '</div>';
  
          if (trial.prompt !== null) {
            html += '<div class="jspsych-prompt">' + trial.prompt + '</div>';
          }
          display_element.innerHTML = html;
  
          display_element.querySelectorAll(".jspsych-image-keyboard-response-modified-stimulus img").forEach(function(img) {
            if (trial.stimulus_height !== null) {
              height = trial.stimulus_height;
              if (trial.stimulus_width == null && trial.maintain_aspect_ratio) {
                width = img.naturalWidth * (trial.stimulus_height / img.naturalHeight);
              }
            } else {
              height = img.naturalHeight;
            }
            if (trial.stimulus_width !== null) {
              width = trial.stimulus_width;
              if (trial.stimulus_height == null && trial.maintain_aspect_ratio) {
                height = img.naturalHeight * (trial.stimulus_width / img.naturalWidth);
              }
            } else if (!(trial.stimulus_height !== null && trial.maintain_aspect_ratio)) {
              width = img.naturalWidth;
            }
            img.style.height = height.toString() + "px";
            img.style.width = width.toString() + "px";
          });
        }
  
        var response = {
          rt: null,
          key: null
        };
  
        const end_trial = () => {
          if (typeof keyboardListener !== "undefined") {
            this.jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
          }
          var trial_data = {
            rt: response.rt,
            stimulus: trial.stimulus,
            response: response.key
          };
          this.jsPsych.finishTrial(trial_data);
        };
  
        var after_response = (info2) => {
          display_element.querySelectorAll(".jspsych-image-keyboard-response-modified-stimulus img").forEach(function(img) {
            img.className += " responded";
          });
          if (response.key == null) {
            response = info2;
          }
          if (trial.response_ends_trial) {
            end_trial();
          }
        };
  
        if (trial.choices != "NO_KEYS") {
          var keyboardListener = this.jsPsych.pluginAPI.getKeyboardResponse({
            callback_function: after_response,
            valid_responses: trial.choices,
            rt_method: "performance",
            persist: false,
            allow_held_key: false
          });
        }
  
        if (trial.stimulus_duration !== null) {
          this.jsPsych.pluginAPI.setTimeout(() => {
            display_element.querySelectorAll(".jspsych-image-keyboard-response-modified-stimulus img").forEach(function(img) {
              img.style.visibility = "hidden";
            });
          }, trial.stimulus_duration);
        }
  
        if (trial.trial_duration !== null) {
          this.jsPsych.pluginAPI.setTimeout(() => {
            end_trial();
          }, trial.trial_duration);
        } else if (trial.response_ends_trial === false) {
          console.warn(
            "The experiment may be deadlocked. Try setting a trial duration or set response_ends_trial to true."
          );
        }
      }
      simulate(trial, simulation_mode, simulation_options, load_callback) {
        if (simulation_mode == "data-only") {
          load_callback();
          this.simulate_data_only(trial, simulation_options);
        }
        if (simulation_mode == "visual") {
          this.simulate_visual(trial, simulation_options, load_callback);
        }
      }
      simulate_data_only(trial, simulation_options) {
        const data = this.create_simulation_data(trial, simulation_options);
        this.jsPsych.finishTrial(data);
      }
      simulate_visual(trial, simulation_options, load_callback) {
        const data = this.create_simulation_data(trial, simulation_options);
        const display_element = this.jsPsych.getDisplayElement();
        this.trial(display_element, trial);
        load_callback();
        if (data.rt !== null) {
          this.jsPsych.pluginAPI.pressKey(data.response, data.rt);
        }
      }
      create_simulation_data(trial, simulation_options) {
        const default_data = {
          stimulus: trial.stimulus,
          rt: this.jsPsych.randomization.sampleExGaussian(500, 50, 1 / 150, true),
          response: this.jsPsych.pluginAPI.getValidKey(trial.choices)
        };
        const data = this.jsPsych.pluginAPI.mergeSimulationData(default_data, simulation_options);
        this.jsPsych.pluginAPI.ensureSimulationDataConsistency(trial, data);
        return data;
      }
    }
  
    return ImageKeyboardResponseModifiedPlugin;
  
  })(jsPsychModule);
  