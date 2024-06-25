import { ImageAdjustment } from "../EffectsApplied/ImageAdjustment";
import { Constants } from "../utils/constants";

/**
 * @class ResetFunction - Class to handle the reset functionality for the slider
 */
export class ResetFunction {
  updateSliderOnReset(imageAdjustment: ImageAdjustment, constants: Constants) {
    imageAdjustment.properties.BRIGHTNESS = constants.BRIGHTNESS;
    imageAdjustment.properties.CONTRAST = constants.CONTRAST;
    imageAdjustment.properties.SATURATION = constants.SATURATION;
    imageAdjustment.properties.SEPIA = constants.SEPIA;
    imageAdjustment.properties.HUE = constants.HUE;
    imageAdjustment.properties.BLUR = constants.BLUR;
    imageAdjustment.properties.OPACITY = constants.OPACITY;
    imageAdjustment.properties.GRAYSCALE = constants.GRAYSCALE;
    imageAdjustment.properties.INVERT = constants.INVERT;
  }
}
