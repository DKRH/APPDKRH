using Microsoft.Web.WebView2.Core;
using System.Diagnostics;
using System.Net.Http;
using System;
using System.Windows;
using System.IO;

namespace Desktop;

public partial class MainWindow : Window
{
    public MainWindow()
    {
        InitializeComponent();

        Loaded += MainWindow_Loaded;
    }

    private async void MainWindow_Loaded(object sender, RoutedEventArgs e)
    {
        await Browser.EnsureCoreWebView2Async();

        Browser.CoreWebView2.Settings.AreDefaultContextMenusEnabled = false;
        Browser.CoreWebView2.Settings.AreDevToolsEnabled = false;

        Browser.Source =new Uri("https://dkrh.dsa.my.id");
    }
}