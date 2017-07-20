/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

/*  'GET /' : {
    cors: {
       origin: '*',
       headers: 'Content-Type, Authorization'  
    },
    controller : 'PublicViewsController',
    action : 'home',
  },*/
  //PUBLIC VIEWS
  'GET /' : {
    controller : 'PublicViewsController',
    action : 'home',
  },
  'GET /Register/Teacher':{
    controller: 'PublicViewsController',
    action: 'register_teacher'
  },
  'GET /Register/Student':{
    controller: 'PublicViewsController',
    action: 'register_student'
  },
  'GET /Login' : {
    controller : 'PublicViewsController',
    action : 'login'
  },
  'GET /Course/:idPeriod':{
    controller: 'PublicViewsController',
    action: 'course_detail'
  },
  'GET /Course/Enrollment/:idPeriod':{
    controller: 'PublicViewsController',
    action: 'course_detail'
  },
  
  //PRIVATE VIEWS
  'GET /Register/Teacher/Profile':{
    controller: 'PrivateViewsController',
    action: 'teacher_register_profile'
  },
  'GET /Register/Student/Categories':{
    controller: 'PrivateViewsController',
    action: 'student_register_categories'
  },
  'GET /Teacher/MyProfile':{
    controller: 'PrivateViewsController',
    action: 'teacher_my_profile'
  },
  'GET /Student/MyProfile':{
    controller: 'PrivateViewsController',
    action: 'student_my_profile'
  },
  'GET /Dashboard':{
    controller: 'PrivateViewsController',
    action: 'dashboard'
  },
  'GET /Register/Course':{
    controller: 'PrivateViewsController',
    action: 'register_course'
  },
  'GET /Course/Activate/:idCourse':{
    controller: "PrivateViewsController",
    action: "activate_course_view"
  },
  'GET /Course/Enrollment/:idEnrollment/Payment':{
    controller: 'PrivateViewsController',
    action: 'payment_enrollment'
  },
  'GET /Course/Private/:idPeriod':{
    controller: 'PrivateViewsController',
    action: 'detailCourse'
  },
  'GET /Course/Private/Enrollment/:idPeriod':{
    controller: 'CourseController',
    action: 'erollment_course'
  },
  'POST /Course/Private/Enrollment':{
    controller: 'CourseController',
    action: 'erollment_course_register'
  },
  'POST /Get/detail':{
    controller: 'PrivateViewsController',
    action: 'course_detail_private'
  },
  
  'GET /Course/Enrollment/:idEnrollment/Invitation':{
    controller: 'PrivateViewsController',
    action: 'invitation_enrollment'
  },
  'GET /MyProfile':{
    controller: 'PrivateViewsController',
    action: 'my_profile'
  },
  //USER CONTROLLER
  'POST /Register/Teacher/New':{
    controller: 'UserController',
    action:'register_teacher_new'
  },
  'GET /Find/Categories':{
    controller: 'UserController',
    action: 'find_categories'
  },
  'POST /Register/Student/New':{
    controller: 'UserController',
    action:'register_student_new'
  },
  'GET /Find/TypeTeacher':{
    controller: 'UserController',
    action: 'find_typeTeacher'
  },
  '/Register/Teacher/Categories/New':{
    controller: 'UserController',
    action: 'save_wizard_teacher'
  },
  '/Register/Student/Categories/New':{
    controller: 'UserController',
    action: 'save_category_student'
  },
  'POST /Teacher/MyProfile/Update':{
    controller: 'UserController',
    action:'register_data_profile_teacher'
  },

  'POST /Student/MyProfile/Update':{
    controller: 'UserController',
    action:'register_data_profile_student'
  },
  'GET /Teachers/Find':{
    controller: 'UserController',
    action: 'find_teachers'
  },
  'GET /Find_Categories_User':{
    controller: 'UserController',
    action: 'find_categories_by_user'
  },
  'PUT /Password/Change/Update' : {
    controller : 'UserController',
    action : 'passwordChange'
  },
  'PUT /Profile/Update' : {
    controller : 'UserController',
    action : 'profileUpdate'
  },
  //COURSE CONTROLLER
  'POST /Register/Course/New':{
    controller: 'CourseController',
    action: 'register_course_new'
  },
  'GET /Find/TypeCourse':{
    controller: "CourseController",
    action: "fin_types"
  },
  'GET /Find/Courses':{
    controller: "CourseController",
    action: "find_courses"
  },
  'GET /Find/Courses/Student':{
    controller: "CourseController",
    action: "find_courses_student"
  },
  'POST /Activate/Course/New':{
    controller:'CourseController',
    action: 'activate_course'
  },
  'GET /Find/Courses/Activate':{
    controller:'CourseController',
    action: 'find_courses_active'
  },
  'POST /GetCategories':{
    controller: 'CourseController',
    action: 'find_category_by_teacher'
  },
  'POST /Course/New/Enrollment':{
    controller: 'CourseController',
    action: 'enrollment_new_user'
  },
  'POST /Course/Enrollment/Login':{
    controller: 'CourseController',
    action: 'enrollment_login'
  },
  'GET /Find/Corses/Active/Teacher':{
    controller: 'CourseController',
    action: 'find_courses_active_teacher'
  },
  'GET /Find/Courses/:permission/:state':{
    controller: 'CourseController',
    action: 'find_courses_list'
  },
  'GET /Find/Students/Course/:id':{
    controller: 'CourseController',
    action: 'find_students_course'
  },
  'GET /Find/Settings':{
    controller: 'SettingsController',
    action: 'search_settings'
  },
  'POST /Save/Coins':{
    controller: 'SettingsController',
    action: 'save_coins'
  },
  'POST /Payment/Enrollment':{
    controller: 'CourseController',
    action: 'payment_login'
  },
  //AUTENTICATHION CONTROLLER
  'GET /Authentication/Login' : {
    controller : 'AuthenticationController',
    action : 'login'
  },
  'GET /Logout' : {
    controller : 'AuthenticationController',
    action : 'logout'
  },
  
  /********************SOCKETS*****************/
  'POST /Sockets/Start' : {
    controller : 'SocketsController',
    action : 'start'
  },
  
  /*********************FIDEL********************/
  'POST /Course/:period/Register/Question':{
    controller: 'CourseController',
    action: 'register_question'
  },
  'GET /Course/:period/Find/Questions':{
    controller: 'CourseController',
    action:'find_questions_course'
  },
  'POST /Course/:period/:question/Register/Answer':{
    controller: 'CourseController',
    action: 'register_answer'
  },
  /*********************Hilder********************/
  'POST /Course/:period/payment/Answer':{
    controller: 'CourseController',
    action: 'payment_answer'
  },
  'GET /Find/TypesFiles':{
    controller: 'CourseController',
    action: 'find_types_files'
  },
  'POST /Course/UploadFile':{
    controller: 'CourseController',
    action: 'upload_file_course'
  },
  'GET /Find/Files/:idPeriod':{
    controller: 'CourseController',
    action: 'find_files_period'
  },
  'POST /Course/:periodId/Rating/New':{
    controller: 'CourseController',
    action:'ratingCourse'
  },
  'POST /Set/IdOnesignal':{
    controller: 'UserController',
    action: 'setonesignal'
  },
  'GET /Find/CoursesMes':{
    controller: 'CourseController',
    action:'cursos_del_mes'
  },
  'POST /Payment/Mercadopago':{
    controller: 'CourseController',
    action: 'payment_mercado'
  },
  'POST /Enrollment/SendInvitation':{
    controller:'CourseController',
    action: 'send_invitation'
  },
  'GET /Course/Enrollment/:idEnrollment/Accept':{
    controller: 'PrivateViewsController',
    action: 'invitation_accept'
  },
  'POST /ValidateEnrrollment':{
    controller: 'CourseController',
    action: 'validate_enrrolment'
  },
  'GET /Course/Enrollment/:idEnrollment/User/Accept':{
    controller: 'PublicViewsController',
    action: 'invitation_accept'
  },
  'POST /Register/Student/New/Enrollment':{
    controller: 'CourseController',
    action: 'register_student_enrrollment'
  },
  'POST /ValidateEnrrollment/Login':{
    controller: 'CourseController',
    action: 'validate_enrrolment_login'
  },
  'GET /Find/Courses/Finish':{
    controller:'CourseController',
    action:'find_courses_finish_teacher'
  },
  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};