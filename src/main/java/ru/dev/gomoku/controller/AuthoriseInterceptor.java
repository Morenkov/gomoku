package ru.dev.gomoku.controller;

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
import ru.dev.gomoku.BLL.BLL;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class AuthoriseInterceptor implements HandlerInterceptor {

    private final BLL bll;

    public AuthoriseInterceptor(BLL bll) {
        this.bll = bll;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String url = request.getRequestURI();
        if (isAllowed(url)) {
            return true;
        } else if (bll.checkToken(request.getHeader("token"))) {
            System.out.println(request.getHeader("token"));
            if (request.getHeader("token") == null) {
                return true;
            }
            return true;
        } else {
            return false;
        }
    }

    private Boolean isAllowed(String url) {
        if (url.equals("/")) return true;
        String[] allowed = {"/enter", "/logout", "/signup", "/signin", "/css/", "/fonts/", "/js/",
                "/activate/", "/setUser", "/emailAlreadyExists", "/authorization", "/loginAlreadyExists", "/profile",
                "/game", "/gameUsers", "/search"};
        for (String str : allowed) {
            if (url.indexOf(str) == 0) {
                return true;
            }
        }
        return false;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {

    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {

    }
}
