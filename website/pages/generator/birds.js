/**
 * This was an (weak) excuse to play with three.js. If the browser supports WebGL, the user is presented with a
 * "Prove it!" link next to the "transparent" option for the Pie BG color. Pointless? Hell yeah! But cool, and pretty
 * as hell - and only loaded on demand, so why don't just just go suck it.
 *
 * The code was swiped from MrDoob's example here: http://mrdoob.github.io/three.js/examples/canvas_geometry_birds.html
 */
define([], function() {

	var _camera, _scene, _renderer, _birds, _boids, _requestId;
	var _numBirds = 150;


	var _init = function(screenWidth, screenHeight) {
		_screenWidth = screenWidth;
		_screenHeight = screenHeight;

		_camera = new THREE.PerspectiveCamera(75, screenWidth / screenHeight, 1, 10000);
		_camera.position.z = 250;

		_scene = new THREE.Scene();
		_birds = [];
		_boids = [];

		var boid;
		for (var i=0; i<_numBirds; i++) {
			boid = _boids[i] = new Boid();
			boid.position.x = Math.random() * 300 - 150;
			boid.position.y = Math.random() * 300 - 150;
			boid.position.z = Math.random() * 300 - 150;
			boid.velocity.x = Math.random() * 1.2 - 1;
			boid.velocity.y = Math.random() * 1.2 - 1;
			boid.velocity.z = Math.random() * 1.2 - 1;
			boid.setAvoidWalls(true);
			boid.setWorldSize(400, 400, 200);

			bird = _birds[i] = new THREE.Mesh( new Bird(), new THREE.MeshBasicMaterial( { color:Math.random() * 0xffffff, side: THREE.DoubleSide } ) );
			bird.phase = Math.floor( Math.random() * 64 );
			bird.position = _boids[i].position;
			_scene.add(bird);
		}
	}

	var _start = function() {
		_renderer = new THREE.CanvasRenderer();
		_renderer.setSize(_screenWidth, _screenHeight);

		document.getElementById("birdyBackground").appendChild(_renderer.domElement);
		animate();
	};

	var _stop = function() {
		window.cancelRequestAnimationFrame(_requestId);
		$("#birdyBackground").html("");
	};

	// --------------------------------------------------------------------------------------------


	var Bird = function() {
		var scope = this;

		THREE.Geometry.call(this);
		v( 5,  0,  0);
		v(-5, -2,  1);
		v(-5,  0,  0);
		v(-5, -2, -1);

		v( 0,  2, -6);
		v( 0,  2,  6);
		v( 2,  0,  0);
		v(-3,  0,  0);

		f3(0, 2, 1);
		f3(4, 7, 6);
		f3(5, 6, 7);

		this.computeCentroids();
		this.computeFaceNormals();

		function v( x, y, z ) {
			scope.vertices.push( new THREE.Vector3( x, y, z ) );
		}

		function f3( a, b, c ) {
			scope.faces.push( new THREE.Face3( a, b, c ) );
		}
	};

	Bird.prototype = Object.create(THREE.Geometry.prototype);


	// Based on http://www.openprocessing.org/visuals/?visualID=6910
	var Boid = function() {
		var vector = new THREE.Vector3(),
			_acceleration, _width = 500, _height = 500, _depth = 200, _goal, _neighborhoodRadius = 100,
			_maxSpeed = 4, _maxSteerForce = 0.1, _avoidWalls = false;

		this.position = new THREE.Vector3();
		this.velocity = new THREE.Vector3();
		_acceleration = new THREE.Vector3();

		this.setGoal = function(target) {
			_goal = target;
		};

		this.setAvoidWalls = function(value) {
			_avoidWalls = value;
		};

		this.setWorldSize = function(width, height, depth) {
			_width = width;
			_height = height;
			_depth = depth;
		};

		this.run = function ( boids ) {
			if (_avoidWalls) {
				vector.set(-_width, this.position.y, this.position.z);
				vector = this.avoid(vector);
				vector.multiplyScalar(5);
				_acceleration.add(vector);

				vector.set(_width, this.position.y, this.position.z);
				vector = this.avoid(vector);
				vector.multiplyScalar(5);
				_acceleration.add(vector);

				vector.set( this.position.x, - _height, this.position.z);
				vector = this.avoid(vector);
				vector.multiplyScalar(5);
				_acceleration.add(vector);

				vector.set(this.position.x, _height, this.position.z);
				vector = this.avoid(vector);
				vector.multiplyScalar(5);
				_acceleration.add(vector);

				vector.set(this.position.x, this.position.y, - _depth);
				vector = this.avoid(vector);
				vector.multiplyScalar(5);
				_acceleration.add(vector);

				vector.set(this.position.x, this.position.y, _depth);
				vector = this.avoid(vector);
				vector.multiplyScalar(5);
				_acceleration.add(vector);
			}

			if (Math.random() > 0.5) {
				this.flock(boids);
			}

			this.move();
		}

		this.flock = function(boids) {
			if (_goal) {
				_acceleration.add(this.reach(_goal, 0.005));
			}
			_acceleration.add(this.alignment(boids));
			_acceleration.add(this.cohesion(boids));
			_acceleration.add(this.separation(boids));
		}

		this.move = function() {
			this.velocity.add(_acceleration);

			var l = this.velocity.length();
			if (l > _maxSpeed) {
				this.velocity.divideScalar(l / _maxSpeed);
			}

			this.position.add(this.velocity);
			_acceleration.set(0, 0, 0);
		}

		this.checkBounds = function() {
			if (this.position.x >   _width) this.position.x = - _width;
			if (this.position.x < - _width) this.position.x =   _width;
			if (this.position.y >   _height) this.position.y = - _height;
			if (this.position.y < - _height) this.position.y =  _height;
			if (this.position.z >  _depth) this.position.z = - _depth;
			if (this.position.z < - _depth) this.position.z =  _depth;
		}

		this.avoid = function(target) {
			var steer = new THREE.Vector3();
			steer.copy(this.position);
			steer.sub(target);
			steer.multiplyScalar( 1 / this.position.distanceToSquared(target));

			return steer;
		}

		this.repulse = function(target) {
			var distance = this.position.distanceTo(target);

			if (distance < 150) {
				var steer = new THREE.Vector3();

				steer.subVectors( this.position, target );
				steer.multiplyScalar( 0.5 / distance );

				_acceleration.add( steer );
			}
		}

		this.reach = function(target, amount) {
			var steer = new THREE.Vector3();
			steer.subVectors(target, this.position);
			steer.multiplyScalar(amount);

			return steer;
		}

		this.alignment = function(boids) {
			var boid, velSum = new THREE.Vector3(),
				count = 0;

			for (var i = 0, il = boids.length; i < il; i++) {
				if ( Math.random() > 0.6) continue;

				boid = boids[i];
				distance = boid.position.distanceTo(this.position);

				if (distance > 0 && distance <= _neighborhoodRadius) {
					velSum.add(boid.velocity);
					count++;
				}
			}

			if (count > 0) {
				velSum.divideScalar(count);

				var l = velSum.length();
				if (l > _maxSteerForce) {
					velSum.divideScalar(l / _maxSteerForce);
				}
			}

			return velSum;
		}

		this.cohesion = function(boids) {
			var boid, distance,
				posSum = new THREE.Vector3(),
				steer = new THREE.Vector3(),
				count = 0;

			for (var i = 0, il = boids.length; i < il; i++) {
				if (Math.random() > 0.6) continue;

				boid = boids[i];
				distance = boid.position.distanceTo( this.position);

				if (distance > 0 && distance <= _neighborhoodRadius) {
					posSum.add( boid.position );
					count++;
				}
			}

			if (count > 0) {
				posSum.divideScalar( count );
			}

			steer.subVectors( posSum, this.position );

			var l = steer.length();
			if (l > _maxSteerForce) {
				steer.divideScalar(l / _maxSteerForce);
			}

			return steer;
		}

		this.separation = function(boids) {
			var boid, distance,
				posSum = new THREE.Vector3(),
				repulse = new THREE.Vector3();

			for (var i = 0, il = boids.length; i < il; i++) {
				if (Math.random() > 0.6) continue;

				boid = boids[i];
				distance = boid.position.distanceTo(this.position);

				if (distance > 0 && distance <= _neighborhoodRadius) {
					repulse.subVectors( this.position, boid.position );
					repulse.normalize();
					repulse.divideScalar( distance );
					posSum.add( repulse );
				}
			}

			return posSum;
		}
	};


	function animate() {
		_requestId = requestAnimationFrame(animate);
		render();
	}

	function render() {
		for (var i = 0, il = _birds.length; i < il; i++) {
			boid = _boids[i];
			boid.run(_boids);
			bird = _birds[i];

			color = bird.material.color;
			color.r = color.g = color.b = ( 500 - bird.position.z ) / 1000;

			bird.rotation.y = Math.atan2( - boid.velocity.z, boid.velocity.x );
			bird.rotation.z = Math.asin( boid.velocity.y / boid.velocity.length() );
			bird.phase = ( bird.phase + ( Math.max( 0, bird.rotation.z) + 0.1)) % 62.83;
			bird.geometry.vertices[5].y = bird.geometry.vertices[4].y = Math.sin(bird.phase) * 5;
		}
		_renderer.render( _scene, _camera );
	}

	return {
		init: _init,
		start: _start,
		stop: _stop
	}
});