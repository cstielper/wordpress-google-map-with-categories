# Wordpress Google Map With Categories
Blah blah blah

## Install Required plugins
NOTE: The included [JSON file](acf-export-landmark-info.json) to import into Advanced Custom fields is for use with the pro version of the plugin.

1. [WordPress REST API (Version 2)](https://wordpress.org/plugins/rest-api/)
2. [Advanced Custom Fields](https://www.advancedcustomfields.com/)
3. [ACF to Rest API (Version 2)](https://wordpress.org/plugins/acf-to-rest-api/)
4. [Radio Buttons for Taxonomies](https://wordpress.org/plugins/radio-buttons-for-taxonomies/)

## Create the custom post type and taxonomy
Add this to your theme's functions.php file. Don't forget to prefix your function names and to flush your permalinks.

~~~~
function YOUR_FUNCTION_PREFIX_create_custom_posts() {
	$labels = array(
		'name'                  => _x( 'Area Landmarks', 'Post Type General Name', 'text_domain' ),
		'singular_name'         => _x( 'Area Landmark', 'Post Type Singular Name', 'text_domain' ),
		'menu_name'             => __( 'Area Landmarks', 'text_domain' ),
		'name_admin_bar'        => __( 'Area Landmarks', 'text_domain' ),
		'archives'              => __( 'Item Archives', 'text_domain' ),
		'parent_item_colon'     => __( 'Parent Item:', 'text_domain' ),
		'all_items'             => __( 'All Landmarks', 'text_domain' ),
		'add_new_item'          => __( 'Add New Landmark', 'text_domain' ),
		'add_new'               => __( 'Add New Landmark', 'text_domain' ),
		'new_item'              => __( 'New Landmark', 'text_domain' ),
		'edit_item'             => __( 'Edit Landmark', 'text_domain' ),
		'update_item'           => __( 'Update Landmark', 'text_domain' ),
		'view_item'             => __( 'View Landmark', 'text_domain' ),
		'search_items'          => __( 'Search Landmarks', 'text_domain' ),
		'not_found'             => __( 'Not found', 'text_domain' ),
		'not_found_in_trash'    => __( 'Not found in Trash', 'text_domain' ),
		'featured_image'        => __( 'Featured Image', 'text_domain' ),
		'set_featured_image'    => __( 'Set featured image', 'text_domain' ),
		'remove_featured_image' => __( 'Remove featured image', 'text_domain' ),
		'use_featured_image'    => __( 'Use as featured image', 'text_domain' ),
		'insert_into_item'      => __( 'Insert into item', 'text_domain' ),
		'uploaded_to_this_item' => __( 'Uploaded to this item', 'text_domain' ),
		'items_list'            => __( 'Items list', 'text_domain' ),
		'items_list_navigation' => __( 'Items list navigation', 'text_domain' ),
		'filter_items_list'     => __( 'Filter items list', 'text_domain' ),
	);
	$args = array(
		'label'                 => __( 'Area Landmark', 'text_domain' ),
		'description'           => __( 'Post Type Description', 'text_domain' ),
		'labels'                => $labels,
		'supports'              => array( 'title', 'revisions', ),
		'taxonomies'            => array( 'landmark_types' ),
		'hierarchical'          => false,
		'public'                => true,
		'show_ui'               => true,
		'show_in_menu'          => true,
		'menu_position'         => 20,
		'menu_icon'             => 'dashicons-location',
		'show_in_admin_bar'     => false,
		'show_in_nav_menus'     => false,
		'can_export'            => true,
		'has_archive'           => false,		
		'exclude_from_search'   => true,
		'publicly_queryable'    => true,
		'capability_type'       => 'post',
		'show_in_rest'			=> true,
	);
	register_post_type( 'area_landmarks', $args );

}
add_action( 'init', 'YOUR_FUNCTION_PREFIX_create_custom_posts', 0 );

function YOUR_FUNCTION_PREFIX_create_custom_taxonomies() {
	$labels = array(
		'name'                       => _x( 'Landmark Types', 'Taxonomy General Name', 'text_domain' ),
		'singular_name'              => _x( 'Landmark Type', 'Taxonomy Singular Name', 'text_domain' ),
		'menu_name'                  => __( 'Landmark Types', 'text_domain' ),
		'all_items'                  => __( 'All Landmark Types', 'text_domain' ),
		'parent_item'                => __( 'Parent Item', 'text_domain' ),
		'parent_item_colon'          => __( 'Parent Item:', 'text_domain' ),
		'new_item_name'              => __( 'New Landmark Type', 'text_domain' ),
		'add_new_item'               => __( 'Add New Landmark Type', 'text_domain' ),
		'edit_item'                  => __( 'Edit Landmark Type', 'text_domain' ),
		'update_item'                => __( 'Update Landmark Type', 'text_domain' ),
		'view_item'                  => __( 'View Landmark Type', 'text_domain' ),
		'separate_items_with_commas' => __( 'Separate items with commas', 'text_domain' ),
		'add_or_remove_items'        => __( 'Add or remove items', 'text_domain' ),
		'choose_from_most_used'      => __( 'Choose from the most used', 'text_domain' ),
		'popular_items'              => __( 'Popular Items', 'text_domain' ),
		'search_items'               => __( 'Search Items', 'text_domain' ),
		'not_found'                  => __( 'Not Found', 'text_domain' ),
		'no_terms'                   => __( 'No items', 'text_domain' ),
		'items_list'                 => __( 'Items list', 'text_domain' ),
		'items_list_navigation'      => __( 'Items list navigation', 'text_domain' ),
	);
	$args = array(
		'labels'                     => $labels,
		'hierarchical'               => true,
		'public'                     => true,
		'show_ui'                    => true,
		'show_admin_column'          => true,
		'show_in_nav_menus'          => false,
		'show_tagcloud'              => false,
		'show_in_rest'				=> true,
	);
	register_taxonomy( 'landmark_types', array( 'area_landmarks' ), $args );

}
add_action( 'init', 'YOUR_FUNCTION_PREFIX_create_custom_taxonomies', 0 );
~~~~

## Setup plugin options
Import the [JSON file](acf-export-landmark-info.json) into Advanced Custom Fields

Add this to your functions.php file to remove the "None" option for Radio Buttons for Taxonomies
~~~~
// Remove option for no type from radio button for taxonomies plugin
add_filter('radio-buttons-for-taxonomies-no-term-landmark_types', '__return_FALSE' );
~~~~

## Output HTML markup to be used by the javascript
Add this to your theme's functions.php file. Don't forget to prefix your function name.
~~~~
function YOUR_FUNCTION_PREFIX_area_map() { ?>
	<div id="map-wrapper">
		<div id="map-canvas"></div>
		<button id="reset-map">Reset</button>
	</div>
	<?php wp_enqueue_script( string $handle, string $src = false, array $deps = array(), string|bool|null $ver = false, bool $in_footer = false );
}
~~~~

You can use this to call the function in your page template:
~~~~
if(function_exists('YOUR_FUNCTION_PREFIX_area_map')) {
  YOUR_FUNCTION_PREFIX_area_map();
}
~~~~
