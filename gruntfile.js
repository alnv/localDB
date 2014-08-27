module.exports = function(grunt){
	
	grunt.initConfig({
		
		uglify: {
			
			options: {
				mangle: true,
				compress: true,
				sourceMap: 'dest/localDB.map'
			},
			
			target: {
				src: 'src/localDB.js',
				dest: 'dest/localDB.min.js'
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
	
	grunt.registerTask("default", ['uglify']);
	
}
