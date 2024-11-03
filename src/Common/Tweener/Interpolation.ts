export enum eInterpolation
{
    INTERPOLATE_TYPE_LINEAR,
    INTERPOLATE_TYPE_SIGMOID,
    INTERPOLATE_TYPE_4SIN,
    INTERPOLATE_TYPE_SIN_ACEL,
    INTERPOLATE_TYPE_SIN_DECEL,
    INTERPOLATE_TYPE_SPRING_063,
    INTERPOLATE_TYPE_BOUNCE_IN,
    INTERPOLATE_TYPE_BOUNCE_OUT
}

// ###################################################

export class Interpolations
{
    public static InterpolateNum(from: number, to: number, delta: number, interplation : eInterpolation): number
    {
        let result = from;

        switch (interplation)
        {
            case eInterpolation.INTERPOLATE_TYPE_LINEAR:
                result = this.LinearInterpolate(from, to, delta);
                break;
            case eInterpolation.INTERPOLATE_TYPE_SIGMOID:
                result = this.SigmoidInterpolate(from, to, delta);
                break;
            case eInterpolation.INTERPOLATE_TYPE_4SIN:
                result = this.Sin4Interpolate(from, to, delta);
                break;
            case eInterpolation.INTERPOLATE_TYPE_SIN_ACEL:
                result = this.SinAccelerateInterpolate(from, to, delta);
                break;
            case eInterpolation.INTERPOLATE_TYPE_SIN_DECEL:
                result = this.SinDecelerateInterpolate(from, to, delta);
                break;
            case eInterpolation.INTERPOLATE_TYPE_SPRING_063:
                result = this.Spring063Interpolate(from, to, delta);
                break;
            case eInterpolation.INTERPOLATE_TYPE_BOUNCE_IN:
                result = this.BounceInInterpolate(from, to, delta);
                break;
            case eInterpolation.INTERPOLATE_TYPE_BOUNCE_OUT:
                result = this.BounceOutInterpolate(from, to, delta);
                break;
        }

        return result;
    }

    // ===============================================

    private static LinearInterpolate(from: number, to: number, delta: number): number
    {
        if (delta <= 0.0)
            return from;
        else if (delta >= 1.0)
            return to;

        return (from * (1.0 - delta)) + (to * delta);
    }

    private static SigmoidInterpolate(from: number, to: number, delta: number): number
    {
        delta = this.Clamp((delta - 0.5) * 2.0, -1.0, 1.0);
        const sigmoid = this.Clamp(1.0 / (1.0 + Math.pow(2.718282, -15.0 * delta)), 0.0, 1.0);
        return (from * (1.0 - sigmoid)) + (to * sigmoid);
    }

    private static Sin4Interpolate(from: number, to: number, delta: number): number
    {
        if (delta <= 0.0)
            return from;
        else if (delta >= 1.0)
            return to;

        const sin_v = (Math.sin(((delta - 0.5) * Math.PI)) + 1) * 0.5;
        return (from * (1.0 - sin_v)) + (to * sin_v);
    }

    private static SinDecelerateInterpolate(from: number, to: number, delta: number): number
    {
        if (delta <= 0.0)
            return from;
        else if (delta >= 1.0)
            return to;

        const sin_v = Math.sin((delta * 0.5) * Math.PI);
        return (from * (1.0 - sin_v)) + (to * sin_v);
    }

    private static SinAccelerateInterpolate(from: number, to: number, delta: number): number
    {
        if (delta <= 0.0)
            return from;
        else if (delta >= 1.0)
            return to;

        const sin_v = (Math.sin(((delta - 1.0) * 0.5) * Math.PI)) + 1.0;
        return (from * (1.0 - sin_v)) + (to * sin_v);
    }

    private static Spring063Interpolate(from: number, to: number, delta: number): number
    {
        if (delta <= 0.0)
            return from;
        else if (delta >= 1.0)
            return to;

        const sin_v = (-Math.cos((delta + 0.08) * 10.0) * (2.0 / (Math.pow(1.9, ((delta + 0.08) * 10.0) * 0.63)))) + 1.0;
        return (from * (1.0 - sin_v)) + (to * sin_v);
    }

    private static BounceInInterpolate(from: number, to: number, delta: number): number
    {
        return from + (1 - Math.abs(Math.sin(10 + 5.28 * (delta + 0.5) * (delta + 0.5)) * (1 - delta)) * (to - from));
    }

    private static BounceOutInterpolate(from: number, to: number, delta: number): number
    {
        return from + (Math.abs(Math.sin(10 + 5.28 * (delta + 0.5) * (delta + 0.5)) * (1 - delta)) * (to - from));
    }

    private static Clamp(value: number, min: number, max: number): number
    {
        return Math.min(Math.max(value, min), max);
    }
}