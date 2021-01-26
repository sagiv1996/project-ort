export default async function({$auth, query, redirect}){
    try {
        await $auth.setUserToken(query.token);
        if (!$auth.loggedIn) return redirect('/');
    } catch (error) {
        return redirect('/');
    }
}