export default function({$auth, route, redirect}){
    console.log($auth.user)
    if ($auth.user.type != route.path.split('/')[1]) {
        return redirect('/');
    }
}