module.exports= function(grunt){
	var portnum = 8000
	require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

	grunt.initConfig({
	 pkg: grunt.file.readJSON('package.json'),

    nodemon:{
        dev:{
            script:'app.js'
        }
    },
    imagemin:{
    	dynamic:{
		  	files: [{
		      expand: true,
		      cwd: 'assets/imgs/',
		      src: ['**/*.{png,gif,jpg,JPG}'],
		      dest: 'app/imgs/'
		    }]
    	}
    },
    copy:{
        main:{
            files:[
            	{expand:true, cwd:'assets/jade', src:['**/*'], dest:'app/jade/', filter:'isFile'},
            	{expand:true, cwd:'assets/videos', src:['**/*'], dest:'app/videos/', filter: 'isFile'},
            	{expand:true, cwd: 'assets/fonts', src:'*', dest:'app/fonts',filter:'isFile'},
            	{expand:true, cwd:'bower_components', src:['*/**'], dest:'app/', filter: 'isFile'},
            	{expand:true, cwd:'assets/css', src:['*'], dest:'app/css/', filter: 'isFile'},
            	{expand:true, cwd:'assets/imgs', src:['*.ico'], dest:'app/imgs/', filter: 'isFile'},
							{expand:true, cwd:'assets/data', src:['*.json'], dest:'app/data/', filter: 'isFile'}
            	]
        }
    },
	 htmlmin:{
	 		dist:{
	 			options:{
	 			removeComments: true,
	 			collapseWhitespace: false,
	 			removeEmptyAttributes: false,
	 			useShortDoctype: true,
	 			removeRedundantAttributes: true,
	 			},
	 			files:[{
	 				expand: true,
	 				cwd: 'assets/html',
	 				src: '*.html',
	 				dest:'app/views'
	 			}]
	 		}
	 	},
    uglify: {
      my_target: {
		    files: [{
		        expand: true,
		        cwd: 'assets/js',
		        src: '**/*.js',
		        dest: 'app/js'
		    }]
     }
    },
	 sass:{
	 	dist:{
	 		files:[{
	 			lineNumbers: true,
	 			expand: true,
	 			cwd: 'assets/sass/',
	 			src: ['**/*.scss', '**/*.sass'],
	 			dest: 'app/css',
	 			ext: '.css'
	 		}]
	 	}
	 },
	 watch:{
	 	options: {
	 		livereload: true
	 	},
	 	jade:{
	 		files: ['assets/jade/**/*',  'assets/jade/jadepages/*/*'],
	 		tasks: ['newer:copy'],
	 		options:{
	 			spawn: false
	 		}
	 	},
	 	scripts:{
	 		files: ['assets/js/**/*'],
	 		tasks: ['uglify'],
	 		options:{
	 			spawn: false
	 		}
	 	},
	 	css:{
	 		files: ['assets/sass/**/*'],
	 		tasks:['newer:sass'],
	 		options:{
	 			spawn: false
	 		}
	 	},
	 	images:{
	 		files: ['assets/imgs/**/*'],
	 		tasks:['newer:imagemin'],
	 		options:{
	 			spawn: false
	 		}
	 	}
	 },
    concurrent:{
        target1: ['newer:sass', 'newer:copy'],
        target2: ['newer:uglify:my_target'],
        target3:{
                tasks:['nodemon', 'watch'],
                options:{
                    logConcurrentOutput : true
                 }
            }
    }

	});
	grunt.registerTask('default',['newer:imagemin','concurrent:target1','concurrent:target2', 'concurrent:target3']);
};
