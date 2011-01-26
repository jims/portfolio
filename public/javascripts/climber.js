var portfolio = null;

jQuery(function  ($) {
	var viewport = $('.main-viewport');
	
	var ClimberApp = function(opts)
	{
		var _ctx,
			_time,
			_timerId,
			_paused = false,
			_quitting = false;
			
		this.renderer = null;
		this.renderTarget = opts.renderTo;
		
		var _fps = 0.0,
			_camera,
			_scene;
			
		$.extend(ClimberApp.prototype, {
			run: function  () {
				this.init();
				self = this;
				_timerId = setInterval(function  () {
					self.tick();
				}, 1000 / 40);
			},
			
			pause: function  () {
				_paused = true;
			},
			
			resume: function  () {
				_paused = false;
			},
			
			init: function  () {
				_time = (new Date).getTime();
				_scene = new THREE.Scene();
				this.renderer = new THREE.CanvasRenderer();
				
				var sz = {w: $(this.renderTarget).innerWidth(), h: $(this.renderTarget).innerHeight()};
				
				_camera = new THREE.Camera(45, sz.w / sz.h, 1, 10000);
				_camera.position.z = 1000;

				this.renderTarget.append(this.renderer.domElement);
				this.renderer.setSize(this.renderTarget.innerWidth(), this.renderTarget.innerHeight());
				_ctx = this.renderer.domElement.getContext('2d');
				
				var app = this;
				$(window).resize(function  () {
					var w = app.renderTarget.innerWidth(),
						h = app.renderTarget.innerHeight();
						
					app.renderer.setSize(app.renderTarget.innerWidth(), app.renderTarget.innerHeight());
					_camera.aspect = w / h;
					_camera.updateProjectionMatrix();
				});
				
				for (var i = 0; i < 100; i++)
				{
			        var particle = new THREE.Particle( new THREE.ParticleCircleMaterial( { color: Math.random() * 0xffffff } ) );
		            particle.position.x = Math.random() * 2000 - 1000;
		            particle.position.y = Math.random() * 2000 - 1000;
		            particle.position.z = Math.random() * 2000 - 1000;
		            particle.scale.x = particle.scale.y = Math.random() * 10 + 5;
		            _scene.addObject( particle );
		        }
			},

			draw: function (renderer) {
				_ctx.save();
				renderer.render(_scene, _camera);
				_ctx.restore();
				
				_ctx.save();
				_ctx.fillText(Math.round(_fps), 100, 100);
				_ctx.restore();
			},
			
			update: function  (dt) {
				_fps = 1 / dt;
			},
			
			quit: function  () {
				_quitting = true;
			},

			tick: function  () {
				var dt = (new Date).getTime() - _time;
				if ( !_paused )
					this.update(dt / 1000);
					
				this.draw(this.renderer);
				_time = (new Date).getTime();
				
				if ( _quitting )
					clearInterval(_timerId);
			}
		});
	};
	
	portfolio = new ClimberApp({
		renderTo: viewport
	});
	
	$(window).unload(function  () {
		portfolio.quit();
	});
	
	$(window).blur(function  () {
		portfolio.pause();
	}).focus(function  () {
		portfolio.resume();
	});
	
	portfolio.run();
});