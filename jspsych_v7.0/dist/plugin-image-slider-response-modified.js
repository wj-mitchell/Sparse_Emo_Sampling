var jsPsychImageSliderResponseModified = (function (jspsych) {
  'use strict';

  const info = {
    name: "image-slider-response-modified",
    version: "2.0.0",
    parameters: {
      stimulus: {
        type: jspsych.ParameterType.IMAGE,
        default: void 0
      },
      stimulus_height: {
        type: jspsych.ParameterType.INT,
        default: null
      },
      stimulus_width: {
        type: jspsych.ParameterType.INT,
        default: null
      },
      stimulus_margin: {
        type: jspsych.ParameterType.INT,
        default: 60
      },
      top_images: {
        type: jspsych.ParameterType.ARRAY,
        array: true,
        default: []
      },
      top_images_height: {
        type: jspsych.ParameterType.INT,
        default: 60
      },
      top_images_margin: {
        type: jspsych.ParameterType.INT,
        default: 20
      },
      maintain_aspect_ratio: {
        type: jspsych.ParameterType.BOOL,
        default: true
      },
      min: {
        type: jspsych.ParameterType.INT,
        default: 0
      },
      max: {
        type: jspsych.ParameterType.INT,
        default: 100
      },
      slider_start: {
        type: jspsych.ParameterType.INT,
        default: 50
      },
      step: {
        type: jspsych.ParameterType.INT,
        default: 1
      },
      labels: {
        type: jspsych.ParameterType.STRING,
        default: [],
        array: true
      },
      slider_width: {
        type: jspsych.ParameterType.INT,
        default: null
      },
      marker: {
        type: jspsych.ParameterType.INT,
        default: null
      },
      marker_color: {
        type: jspsych.ParameterType.STRING,
        default: "#000000"
      },
      marker_height: {
        type: jspsych.ParameterType.INT,
        default: 25
      },
      marker_width: {
        type: jspsych.ParameterType.INT,
        default: 16
      },
      marker_label: {
        type: jspsych.ParameterType.STRING,
        default: null
      },
      show_value: {
        type: jspsych.ParameterType.BOOL,
        default: true
      },
      absolute_value: {
        type: jspsych.ParameterType.BOOL,
        default: true
      },
      value_unit: {
        type: jspsych.ParameterType.STRING,
        default: ""
      },
      button_label: {
        type: jspsych.ParameterType.STRING,
        default: "Continue",
        array: false
      },
      require_movement: {
        type: jspsych.ParameterType.BOOL,
        default: false
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
        type: jspsych.ParameterType.INT
      },
      rt: {
        type: jspsych.ParameterType.INT
      },
      slider_start: {
        type: jspsych.ParameterType.INT
      }
    }
  };

  class ImageSliderResponseModifiedPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    static info = info;
    trial(display_element, trial) {
      var height, width;
      var html;
      var half_thumb_width = 7.5;

      if (trial.render_on_canvas) {
        var image_drawn = false;
        if (display_element.hasChildNodes()) {
          while (display_element.firstChild) {
            display_element.removeChild(display_element.firstChild);
          }
        }

        var content_wrapper = document.createElement("div");
        content_wrapper.id = "jspsych-image-slider-response-modified-wrapper";
        content_wrapper.style.margin = "100px 0px";

        var canvas = document.createElement("canvas");
        canvas.id = "jspsych-image-slider-response-modified-stimulus";
        canvas.style.marginBottom = String(trial.stimulus_margin) + "px";
        canvas.style.padding = "0";
        var ctx = canvas.getContext("2d");

        var img = new Image();
        img.onload = () => {
          if (!image_drawn) {
            getHeightWidth();
            ctx.drawImage(img, 0, 0, width, height);
          }
        };
        img.src = trial.stimulus;

        const getHeightWidth = () => {
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
          canvas.height = height;
          canvas.width = width;
        };

        getHeightWidth();

        var slider_container = document.createElement("div");
        slider_container.classList.add("jspsych-image-slider-response-modified-container");
        slider_container.style.position = "relative";
        slider_container.style.margin = "0 auto 3em auto";
        if (trial.slider_width !== null) {
          slider_container.style.width = trial.slider_width.toString() + "px";
        }

        html = '<input type="range" class="jspsych-slider" value="' + trial.slider_start + '" min="' + trial.min + '" max="' + trial.max + '" step="' + trial.step + '" id="jspsych-image-slider-response-modified-response"></input>';
        html += "<div>";
        for (var j = 0; j < trial.labels.length; j++) {
          var label_width_perc = 100 / (trial.labels.length - 1);
          var percent_of_range = j * (100 / (trial.labels.length - 1));
          var percent_dist_from_center = (percent_of_range - 50) / 50 * 100;
          var offset = percent_dist_from_center * half_thumb_width / 100;
          html += '<div style="border: 1px solid transparent; display: inline-block; position: absolute; left:calc(' + percent_of_range + "% - (" + label_width_perc + "% / 2) - " + offset + "px); text-align: center; width: " + label_width_perc + '%;">';
          html += '<span style="text-align: center; font-size: 80%;">' + trial.labels[j] + "</span>";
          html += "</div>";
        }
        html += "</div>";

        slider_container.innerHTML = html;

        // Add top images
        if (trial.top_images.length > 0) {
          var top_images_container = document.createElement("div");
          top_images_container.style.display = "flex";
          top_images_container.style.justifyContent = "center"; // Center align images
          top_images_container.style.gap = "20px"; // Add gap between images
          top_images_container.style.marginBottom = String(trial.top_images_margin) + "px";
          top_images_container.style.marginTop = "20px"; // Add top margin to increase distance from the center
          trial.top_images.forEach(image_url => {
            var img = document.createElement("img");
            img.src = image_url;
            img.style.height = String(trial.top_images_height) + "px"; // or another height you prefer
            img.style.width = "auto";
            top_images_container.appendChild(img);
          });
          content_wrapper.appendChild(top_images_container);
        }
        
        content_wrapper.appendChild(canvas);
        content_wrapper.appendChild(slider_container);
        
        // Add current value display
        if (trial.show_value) {
          var value_display = document.createElement("div");
          value_display.id = "jspsych-image-slider-response-modified-value";
          value_display.style.position = "absolute";
          value_display.style.bottom = "calc(100% + 10px)";
          value_display.style.left = "50%";
          value_display.style.transform = "translateX(-50%)";
          value_display.style.whiteSpace = "nowrap";          
        
          var update_value_display = () => {
            var current_value = display_element.querySelector("#jspsych-image-slider-response-modified-response").valueAsNumber;    
            if (trial.absolute_value) {
              current_value = Math.abs(current_value);
            }
            value_display.innerHTML = current_value + trial.value_unit;
            slider_container.appendChild(value_display);
          };
        }
                
        html = '<input type="range" class="jspsych-slider" value="' + trial.slider_start + '" min="' + trial.min + '" max="' + trial.max + '" step="' + trial.step + '" id="jspsych-image-slider-response-modified-response"></input>';
        html += "<div>";
        for (var j = 0; j < trial.labels.length; j++) {
          var label_width_perc = 100 / (trial.labels.length - 1);
          var percent_of_range = j * (100 / (trial.labels.length - 1));
          var percent_dist_from_center = (percent_of_range - 50) / 50 * 100;
          var offset = percent_dist_from_center * half_thumb_width / 100;
          html += '<div style="border: 1px solid transparent; display: inline-block; position: absolute; left:calc(' + percent_of_range + "% - (" + label_width_perc + "% / 2) - " + offset + "px); text-align: center; width: " + label_width_perc + '%;">';
          html += '<span style="text-align: center; font-size: 80%;">' + trial.labels[j] + "</span>";
          html += "</div>";
        }
        html += "</div>";
        slider_container.innerHTML = html;
        
        content_wrapper.insertBefore(canvas, content_wrapper.nextElementSibling); 
        content_wrapper.insertBefore(slider_container, canvas.nextElementSibling);
        display_element.insertBefore(content_wrapper, null);
        
        // Ensure slider element is present in the DOM before accessing it
        const slider_element = display_element.querySelector("#jspsych-image-slider-response-modified-response");
        if (slider_element) {
          slider_element.addEventListener("input", update_value_display);
          update_value_display();
        }

        // Add marker label
        if (trial.marker !== null) {
          var marker = document.createElement("div");
          marker.style.position = "absolute";
          console.log((trial.marker - trial.min) / (trial.max - trial.min))
          console.log(trial.marker - trial.min)
          console.log(trial.max - trial.min)
          marker.style.left = ((trial.marker - trial.min + 1) / (trial.max - trial.min + 4)) * 100 + "%"; // +1 shifts the marker position  to the right; + 4 reduces the maximum width of marker; both are arbitrary to properly scale the scale; it's not quite right without it.
          marker.style.width = trial.marker_width + "px";
          marker.style.height = trial.marker_height + "px";
          marker.style.backgroundColor = trial.marker_color;
          marker.style.top = "50%";
          console.log(marker)
          marker.style.transform = "translateY(-50%)";
          console.log(marker)
          marker.style.opacity = "0.5"; 
          slider_container.appendChild(marker);

          if (trial.marker_label !== null) {
            var marker_label = document.createElement("div");
            marker_label.style.position = "absolute";
            marker_label.style.left = ((trial.marker - trial.min) / (trial.max - trial.min)) * 100 + "%";
            marker_label.style.transform = "translateX(-50%)";
            marker_label.style.top = "calc(50% + " + (trial.marker_height / 2 + 5) + "px)";
            marker_label.style.fontSize = "80%";
            marker_label.style.whiteSpace = "nowrap"; // Ensure the marker label does not wrap to the next line
            marker_label.innerHTML = trial.marker_label;
            slider_container.appendChild(marker_label);
          }
        }

        display_element.appendChild(content_wrapper);

        if (img.complete && Number.isFinite(width) && Number.isFinite(height)) {
          ctx.drawImage(img, 0, 0, width, height);
          image_drawn = true;
        }

        if (trial.prompt !== null) {
          display_element.insertAdjacentHTML("beforeend", trial.prompt);
        }

        var submit_btn = document.createElement("button");
        submit_btn.id = "jspsych-image-slider-response-modified-next";
        submit_btn.classList.add("jspsych-btn");
        submit_btn.disabled = trial.require_movement ? true : false;
        submit_btn.innerHTML = trial.button_label;
        display_element.appendChild(submit_btn);
      } else {
        html = '<div id="jspsych-image-slider-response-modified-wrapper" style="margin: 100px 0px;">';
        html += '<div id="jspsych-image-slider-response-modified-stimulus">';
        html += '<img src="' + trial.stimulus + '" style="';
        if (trial.stimulus_height !== null) {
          html += "height:" + trial.stimulus_height + "px; ";
          if (trial.stimulus_width == null && trial.maintain_aspect_ratio) {
            html += "width: auto; ";
          }
        }
        if (trial.stimulus_width !== null) {
          html += "width:" + trial.stimulus_width + "px; ";
          if (trial.stimulus_height == null && trial.maintain_aspect_ratio) {
            html += "height: auto; ";
          }
        }
        html += '"></img>';
        html += "</div>";
        html += '<div class="jspsych-image-slider-response-modified-container" style="position:relative; margin: 0 auto 3em auto; width:';
        if (trial.slider_width !== null) {
          html += trial.slider_width + "px;";
        } else {
          html += "auto;";
        }
        html += '">';
        html += '<input type="range" class="jspsych-slider" value="' + trial.slider_start + '" min="' + trial.min + '" max="' + trial.max + '" step="' + trial.step + '" id="jspsych-image-slider-response-modified-response"></input>';
        html += "<div>";
        for (var j = 0; j < trial.labels.length; j++) {
          var label_width_perc = 100 / (trial.labels.length - 1);
          var percent_of_range = j * (100 / (trial.labels.length - 1));
          var percent_dist_from_center = (percent_of_range - 50) / 50 * 100;
          var offset = percent_dist_from_center * half_thumb_width / 100;
          html += '<div style="border: 1px solid transparent; display: inline-block; position: absolute; left:calc(' + percent_of_range + "% - (" + label_width_perc + "% / 2) - " + offset + "px); text-align: center; width: " + label_width_perc + '%;">';
          html += '<span style="text-align: center; font-size: 80%;">' + trial.labels[j] + "</span>";
          html += "</div>";
        }
        html += "</div>";
        html += '<div id="jspsych-image-slider-response-modified-value" style="text-align: center; font-size: 150%; margin-top: 10px; white-space: nowrap;">' + Math.abs(trial.slider_start) + trial.value_unit + '</div>';
        html += "</div>";
        html += '<div style="text-align: center; margin-top: 10px;"></div>';
        html += "</div>";
        if (trial.prompt !== null) {
          html += trial.prompt;
        }
        html += '<button id="jspsych-image-slider-response-modified-next" class="jspsych-btn" ' + (trial.require_movement ? "disabled" : "") + ">" + trial.button_label + "</button>";
        display_element.innerHTML = html;
        var img = display_element.querySelector("img");
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
      }

      var response = {
        rt: null,
        response: null
      };

      if (trial.require_movement) {
        const enable_button = () => {
          display_element.querySelector(
            "#jspsych-image-slider-response-modified-next"
          ).disabled = false;
        };
        display_element.querySelector("#jspsych-image-slider-response-modified-response").addEventListener("mousedown", enable_button);
        display_element.querySelector("#jspsych-image-slider-response-modified-response").addEventListener("touchstart", enable_button);
        display_element.querySelector("#jspsych-image-slider-response-modified-response").addEventListener("change", enable_button);
      }

      const end_trial = () => {
        var trialdata = {
          rt: response.rt,
          stimulus: trial.stimulus,
          slider_start: trial.slider_start,
          response: response.response
        };
        this.jsPsych.finishTrial(trialdata);
      };

      display_element.querySelector("#jspsych-image-slider-response-modified-next").addEventListener("click", () => {
        var endTime = performance.now();
        response.rt = Math.round(endTime - startTime);
        response.response = display_element.querySelector(
          "#jspsych-image-slider-response-modified-response"
        ).valueAsNumber;
        if (trial.response_ends_trial) {
          end_trial();
        } else {
          display_element.querySelector(
            "#jspsych-image-slider-response-modified-next"
          ).disabled = true;
        }
      });

      if (trial.stimulus_duration !== null) {
        this.jsPsych.pluginAPI.setTimeout(() => {
          display_element.querySelector(
            "#jspsych-image-slider-response-modified-stimulus"
          ).style.visibility = "hidden";
        }, trial.stimulus_duration);
      }

      if (trial.trial_duration !== null) {
        this.jsPsych.pluginAPI.setTimeout(() => {
          end_trial();
        }, trial.trial_duration);
      }

      var startTime = performance.now();
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

    create_simulation_data(trial, simulation_options) {
      const default_data = {
        stimulus: trial.stimulus,
        slider_start: trial.slider_start,
        response: this.jsPsych.randomization.randomInt(trial.min, trial.max),
        rt: this.jsPsych.randomization.sampleExGaussian(500, 50, 1 / 150, true)
      };
      const data = this.jsPsych.pluginAPI.mergeSimulationData(default_data, simulation_options);
      this.jsPsych.pluginAPI.ensureSimulationDataConsistency(trial, data);
      return data;
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
        const el = display_element.querySelector("input[type='range']");
        setTimeout(() => {
          this.jsPsych.pluginAPI.clickTarget(el);
          el.valueAsNumber = data.response;
        }, data.rt / 2);
        this.jsPsych.pluginAPI.clickTarget(display_element.querySelector("button"), data.rt);
      }
    }
  }

  return ImageSliderResponseModifiedPlugin;

})(jsPsychModule);