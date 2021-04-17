export type ColorFunc = (x: number, y: number) => number;

// (x*y % 2)/2, (x*y % 3)/3, (x*y % 5)/5, 1/7
// sin(1 / log(cos(x) + 1 / tan(y))), cos(1 / log(tan(x) + 1 / sin(y))), tan(1 / log(sin(x) + 1 / cos(y))), 1/4
// sin(sqrt(abs(x+y))), sin(x/y), sin(pow(abs(y), abs(x)) + pow(abs(x), abs(y))), 1/10
// x, y, x+y, 1
// ((y-cosh(x*3)) - 0.1)% 1, y/3, y/2, 1