module.exports = function(grunt) {
	'use strict';

	grunt.initConfig({
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				'admin/assets/js/src/wplinkchooser.js',
				'admin/assets/js/src/app.js'
			]
		},
		less: {
			development: {
				options: {
					paths: ['css']
				},
				files: {
					'admin/assets/css/styles.dev.css' : 'admin/assets/css/src/styles.less'
				}
			},
			production: {
				options: {
					paths: ['css'],
					yuicompress: true
				},
				files: {
					'admin/assets/css/styles.min.css' : 'admin/assets/css/styles.dev.css'
				}
			}
		},
		uglify: {
			development: {
				options: {
					mangle: false,
					compress: false,
					beautify: true
				},
				files: {
					'admin/assets/js/scripts.dev.js': [
						'admin/assets/js/src/wplinkchooser.js',
						'admin/assets/js/src/app.js'
						]
				}
			},
			production: {
				options: {
					compress: {
						global_defs: {
							'DEBUG': false
						},
						dead_code: true
					}
				},
				files: {
					'admin/assets/js/scripts.min.js': [
					'admin/assets/js/scripts.dev.js'
					]
				}
			}
		},

		watch: {
			less: {
				files: [
				'admin/assets/css/src/styles.less'
				],
				tasks: ['less:development'],
				options: {
					spawn: false
				}
			},
			js: {
				files: [
				'admin/assets/js/src/**/*.js'
				],
				tasks: ['jshint', 'uglify:development'],
				options: {
					spawn: false
				}
			}
		},
		clean: {
			dist: [
			'admin/assets/css/styles.min.css',
			'admin/assets/js/scripts.min.js'
			]
		}
	});

	// Load tasks
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	
	// Register tasks
	grunt.registerTask('default', [
		'jshint',
		'clean',
		'uglify',
		'less'
		]);
	
	grunt.registerTask('prod', [
		'jshint',
		'clean',
		'uglify:production',
		'less:production'
	]);

	grunt.registerTask('dev', [
		'watch'
		]);

};