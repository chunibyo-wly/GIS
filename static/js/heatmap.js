    $.fn.RangeSlider = function(cfg){
        this.sliderCfg = {
            min: cfg && !isNaN(parseFloat(cfg.min)) ? Number(cfg.min) : null,
            max: cfg && !isNaN(parseFloat(cfg.max)) ? Number(cfg.max) : null,
            step: cfg && Number(cfg.step) ? cfg.step : 1,
            callback: cfg && cfg.callback ? cfg.callback : null
        };

        let $input = $(this);
        let min = this.sliderCfg.min;
        let max = this.sliderCfg.max;
        let step = this.sliderCfg.step;
        let callback = this.sliderCfg.callback;

        $input.attr('min', min)
            .attr('max', max)
            .attr('step', step);

        $input.bind("input", function(e){
            $input.attr('value', this.value);
            $input.css( 'background', 'linear-gradient(to right, #059CFA, white ' + this.value + '%, white)' );

            if ($.isFunction(callback)) {
                callback(this);
            }
        });
    };