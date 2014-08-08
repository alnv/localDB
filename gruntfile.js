module.exports = function(grunt){
	
	grunt.initConfig({
		uglify: {
			
			options: {
				mangle: true,
				compress: true,
				sourceMap: 'dest/beagle.map',
			},
			target: {
				src: 'src/main.js',
				dest: 'dest/beagle.min.js'
			}
			
		},
		watch: {
			script: {
				files: ['src/*.js'],
				tasks: ['uglify'],
				options: {
					livereload: 3111
				}
			}
		}
	});
	
	
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	
	grunt.registerTask("default", ['concat', 'uglify']);
	
}
