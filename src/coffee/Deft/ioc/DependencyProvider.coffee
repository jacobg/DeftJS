###
Copyright (c) 2012 [DeftJS Framework Contributors](http://deftjs.org)
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).
###

###*
@private

Used by {@link Deft.ioc.Injector}.
###
Ext.define( 'Deft.ioc.DependencyProvider',
	
	config:
		identifier: null
		###*
		Class to be instantiated, by either full name, alias or alternate name, to resolve this dependency.
		###
		className: null
		
		###*
		Optional arguments to pass to the class' constructor when instantiating a class to resolve this dependency.
		###
		parameters: null
		
		###*
		Factory function to be executed to obtain the corresponding object instance or value to resolve this dependency.
		
		NOTE: For lazily instantiated dependencies, this function will be passed the object instance for which the dependency is being resolved.
		###
		fn: null
		
		###*
		Value to use to resolve this dependency.
		###
		value: null
		
		###*
		Indicates whether this dependency should be resolved as a singleton, or as a transient value for each resolution request.
		###
		singleton: true
		
		###*
		Indicates whether this dependency should be 'eagerly' instantiated when this provider is defined, rather than 'lazily' instantiated when later requested.
		
		NOTE: Only valid when either a factory function or class is specified as a singleton.
		###
		eager: false
	
	constructor: ( config ) ->
		@initConfig( config )
		
		if @getEager()
			if @getValue()? 
				Ext.Error.raise( "Error while configuring '#{ @getIdentifier() }': a 'value' cannot be created eagerly." )
			if not @getSingleton()
				Ext.Error.raise( "Error while configuring '#{ @getIdentifier() }': only singletons can be created eagerly." )
		
		if not @getSingleton()
			if @getValue()? 
				Ext.Error.raise( "Error while configuring '#{ @getIdentifier() }': a 'value' can only be configured as a singleton." )
		
		return @
	
	###*
	Resolve a target instance's dependency with an object instance or value generated by this dependency provider.
	###
	resolve: ( targetInstance ) ->
		Ext.log( "Resolving '#{ @getIdentifier() }'." )
		if @getValue()?
			return @getValue()
		
		instance = null
		if @getFn()?
			Ext.log( "Executing factory function." )
			instance = @fn( targetInstance )
		else if @getClassName()?
			Ext.log( "Creating instance of '#{ @getClassName() }'." )
			parameters = if @getParameters()? then [ @getClassName() ].concat( @getParameters() ) else [ @getClassName() ]
			instance = Ext.create.apply( @, parameters )
		else
			Ext.Error.raise( "Error while configuring rule for '#{ @getIdentifier() }': no 'value', 'fn', or 'className' was specified." )
		
		if @getSingleton()
			@setValue( instance )
		
		return instance
)