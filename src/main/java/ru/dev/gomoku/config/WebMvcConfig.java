package ru.dev.gomoku.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import ru.dev.gomoku.BLL.BLL;
import ru.dev.gomoku.controller.AuthoriseInterceptor;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    public WebMvcConfig(BLL bll) {
        this.bll = bll;
    }

    private final BLL bll;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new AuthoriseInterceptor(bll));
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/");
    }
}