/**
 * 
 * @param $auth the auth moudle
 * @param route  the route moudlr 
 * @param redirect לאן להפנות? 
 *  הפונקציה מפנה את המשתמש לעמוד רלונוטי לפי סוג המשתמש
 */
export default function({$auth, route, redirect}){
    if ($auth.user.type != route.path.split('/')[1]) {
        return redirect('/');
    }
}