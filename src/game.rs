use std::f32;
use std::ops::{Index,IndexMut};

extern {
  fn random() -> f64;
  fn log(v: i32);
  fn logf(v: f32);
}

#[derive(Clone,Copy)]
struct Coordinate {
  c: u32,
  r: u32
}

struct Layer {
  values: [f32; (SIZE * SIZE) as usize]
}

impl Index<Coordinate> for Layer {
  type Output = f32;

  fn index(&self, index: Coordinate) -> &f32 {
    let Coordinate { c, r } = index;
    &self.values[((c % SIZE) * SIZE + (r % SIZE)) as usize]
  }
}

impl IndexMut<Coordinate> for Layer {
  fn index_mut(&mut self, index: Coordinate) -> &mut f32 {
    let Coordinate { c, r } = index;
    &mut self.values[((c % SIZE) * SIZE + (r % SIZE)) as usize]
  }
}

struct Game {
  terrain: Layer,
  water: Layer
}

impl Game {
  fn water_level(&self, a: Coordinate) -> f32 {
    self.terrain[a] + self.water[a]
  }

  fn water_givingness(&self, a: Coordinate) -> f32 {
    if self.water[a] > 0.0 { 1.0 } else { (self.water[a] / DRY_DEPTH + 1.0).min(1.0).max(0.0) }
  }

  fn flow(&mut self, a: Coordinate, b: Coordinate) {
    let flow_amount =
      (self.water_level(a) - self.water_level(b)).max(0.0) * self.water_givingness(a) * 0.4;
    self.water[a] -= flow_amount;
    self.water[b] += flow_amount;
    self.terrain[a] -= flow_amount * 0.001;
    self.terrain[b] += flow_amount * 0.001;
  }

  #[inline(always)]
  fn consider_pair(&mut self, a: Coordinate, b: Coordinate) {
    self.flow(a, b);
    self.flow(b, a);
  }

  fn tick(&mut self) {
    // TODO: Buffer this somewhere so it isn't easier to flow in one direction? Or find another hack
    for c in 0..SIZE {
      for r in 0..SIZE {
        let a = Coordinate { c, r };
        let b = Coordinate { c: c + 1, r: r };
        let c = Coordinate { c: c, r: r + 1 };
        self.consider_pair(a, b);
        self.consider_pair(a, c);
       }
    }
  }

  fn init(&mut self) {
    for (index, mut cell) in self.terrain.values.iter_mut().enumerate() {
      let x = (index as i32 % SIZE as i32) as f32;
      let y = (index as i32 / SIZE as i32) as f32;
      let s = noise(x / 8.0, y / 8.0) + 0.5;
      let l = noise((x + SIZE as f32) / 24.0, y / 24.0) + 1.0;
      let b = noise((x + 2.0 * SIZE as f32) / 64.0, y / 64.0) + 1.0;
      *cell = (s * 0.7 +
               l * 1.8 +
               b * 0.8) * (128.0 / 3.0);
    }

    for mut water in self.water.values.iter_mut() {
      *water = unsafe { random() as f32 } * 15.0 - 5.0;
    }
  }
}

static mut GAME: Game =
  Game {
    terrain: Layer { values: [0.0; (SIZE * SIZE) as usize] },
    water: Layer { values: [0.0; (SIZE * SIZE) as usize] }
  };
static mut NOISE: Noise =
  Noise {
    seed: [0; 256 as usize]
  };

#[no_mangle]
pub fn init() {
  unsafe {
    NOISE.init();
    GAME.init();
  }
}

#[no_mangle]
pub fn tick() {
  unsafe { GAME.tick(); }
}

#[no_mangle]
pub fn address() -> u32 {
  unsafe { (&GAME as *const _) as u32 }
}
fn noise(x: f32, y: f32) -> f32 {
    unsafe { NOISE.get(x, y) }
}

static GRAD3: [[i8; 3]; 12] = [
  [ 1, 1, 0],
  [-1, 1, 0],
  [ 1,-1, 0],
  [-1,-1, 0],
  [ 1, 0, 1],
  [-1, 0, 1],
  [ 1, 0,-1],
  [-1, 0,-1],
  [ 0, 1, 1],
  [ 0,-1, 1],
  [ 0, 1,-1],
  [ 0,-1,-1]
];

struct Noise {
  seed: [u8; 256 as usize]
}

impl Noise {
  fn init(&mut self) {
    for mut cell in self.seed.iter_mut() {
      *cell = (unsafe { random() } * 256.0) as u8;
    }
  }


  fn get(&self, x: f32, y: f32) -> f32 {
    let f2 = 0.5 * ((3 as f32).sqrt() - 1.0);
    let s = (x + y) * f2;
    let i = (x + s).floor();
    let j = (y + s).floor();
    let g2 = (3.0 - (3 as f32).sqrt()) / 6.0;
    let t = (i + j) * g2;
    let (x0, y0) = (i - t, j - t); // Unskew the cell origin back to (x,y) space
    let (x0, y0) = (x - x0, y - y0); // The x,y distances from the cell origin
    // For the 2D case, the simplex shape is an equilateral triangle.
    // Determine which simplex we are in.
    let (i1, j1) = if x0 > y0 { (1.0, 0.0) } else { (0.0, 1.0) }; // Offsets for second (middle) corner of simplex in (i,j) coords
    let (x1, y1) = (x0 - i1 + g2, y0 - j1 + g2);
    let (x2, y2) = (x0 - 1.0 + 2.0 * g2, y0 - 1.0 + 2.0 * g2);
    let (ii, jj) = ((i as i32) as u8, (j as i32) as u8);
    let gi0 = self.seed[(ii+self.seed[jj as usize]) as usize] % 12;
    let gi1 = self.seed[(ii+(i1 as u8)+self.seed[(jj+(j1 as u8)) as usize]) as usize] % 12;
    let gi2 = self.seed[(ii+1+self.seed[(jj+1) as usize]) as usize] % 12;
    let t0 = 0.5 - x0.powf(2.0) - y0.powf(2.0);
    let n0 = if t0 < 0.0 { 0.0 } else { t0.powf(4.0) * self.dot(GRAD3[gi0 as usize], x0, y0) };
    let t1 = 0.5 - x1.powf(2.0) - y1.powf(2.0);
    let n1 = if t1 < 0.0 { 0.0 } else { t1.powf(4.0) * self.dot(GRAD3[gi1 as usize], x1, y1) };
    let t2 = 0.5 - x2.powf(2.0) - y2.powf(2.0);
    let n2 = if t2 < 0.0 { 0.0 } else { t2.powf(4.0) * self.dot(GRAD3[gi2 as usize], x2, y2) };
    return 70.0 * (n0 + n1 + n2);
  }

  fn dot(&self, grid: [i8; 3], x: f32, y: f32) -> f32 {
    ((grid[0] as f32) * x + (grid[1] as f32) * y) as f32
  }
}