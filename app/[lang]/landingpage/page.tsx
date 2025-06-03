'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import Image from 'next/image';
import Footer from '@/components/footer/footer';
// Components
const ArrowIcon = ({ className = '' }: { className?: string }) => (
  <svg className={`ml-1 w-5 h-6 ${className}`} viewBox="-3 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16.2548 11.1002L11.4272 6.2726L12.6998 5L19.7 12.0002L12.6998 19.0004L11.4272 17.7278L16.2548 12.9002H5.29999V11.1002H16.2548Z"
      fill="currentColor"
    />
  </svg>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h1 className="text-[40px] text-center mb-10">{children}</h1>
);

const FeatureCard = ({ icon, title, description, gifSize = 48 }: { icon: string; title: string; description: string; gifSize?: number }) => (
  <div className="w-1/4 p-6">
    <div className="w-[60px] h-[72px]">
      <Image
        src={`/images/landing_page/${icon}`}
        alt={title}
        width={gifSize}
        height={gifSize}
        className="mb-6"
        style={{ color: "transparent" }}
      />
    </div>
    <h2 className="text-[1.25rem] mb-3">{title}</h2>
    <p className="text-gray-600">{description}</p>
  </div>
);

const ProcessCard = ({ title, description, image }: { title: string; description: string; image: string }) => (
  <div className="w-1/3 border border-[#d5d5d5] rounded-2xl p-4">
    <div className="p-2 mb-6">
      <h2 className="text-[1.5rem] mb-3">{title}</h2>
      <p className="py-3">{description}</p>
    </div>
    <Image
      src={`/images/landing_page/${image}`}
      alt={title}
      width={400}
      height={300}
      className="border border-[#ddd] rounded-2xl"
      style={{ color: "transparent" }}
    />
  </div>
);

const TrustCard = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
  <div className="border border-[#d5d5d5] rounded-2xl p-10">
    <div className="flex items-center leading-8">
      <Image
        src={`/images/landing_page/${icon}`}
        alt={title}
        width={36}
        height={36}
        className="mr-2"
      />
      <h2 className="text-[1.5rem] mb-4 ml-2">{title}</h2>
    </div>
    <p className="text-base">{description}</p>
  </div>
);

const RightBorderDecoration = () => (
  <div className="h-auto w-0 w-px border-r border-[#dedede] mt-4 mb-4"></div>
);

const WorkflowButton = ({ icon, children, isActive = false }: { icon: string; children: React.ReactNode; isActive?: boolean }) => (
  <button className={`w-40 border border-[#d5d5d5] rounded-full flex items-center px-5 py-2.5 ${isActive ? 'bg-black text-white' : ''}`}>
    <Image
      src={`/images/landing_page/${icon}`}
      alt="icon"
      width={20}
      height={20}
      className="mr-2"
    />
    {children}
  </button>
);

const Tag = ({ children }: { children: React.ReactNode }) => (
  <div className="border border-[#d5d5d5] px-2 py-0.5 rounded-lg">
    {children}
  </div>
);

export default function LandingPage() {
  const [, lang] = usePathname().split('/');
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  return (
    <>
      <div className="text-sm">
        <section className="text-center px-[120px]">
          <h1 className="text-[56px] mt-20 mb-10">
            从音乐爱好者到专业制作人 <br />
            每一步都有专业护航
          </h1>
          <div className="flex justify-center my-10">
            <button className="flex items-center bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-300">
              免费开始
              <ArrowIcon className="text-white" />
            </button>
          </div>
        </section>

        {/* Service Cards */}
        <section className="flex px-[120px] gap-6 h-64 my-10">
          <div className="w-1/2 rounded-2xl p-8 flex flex-col justify-between h-64 bg-black text-white">
            <button className="rounded-full px-5 py-1.5 w-fit border border-gray-500 bg-gradient-to-r from-white/50 to-white/20">
              招募者
            </button>
            <h2 className="text-[1.5rem]">寻找专业服务</h2>
            <h3 className="text-lg">发布需求、设定预算，快速匹配专业音频工作者</h3>
            <button className="flex items-center px-4 py-2 rounded-lg w-fit bg-white text-black">
              开始
              <ArrowIcon />
            </button>
          </div>

          <div className="w-1/2 rounded-2xl p-8 flex flex-col justify-between h-64 border border-gray-200">
            <button className="rounded-full px-5 py-1.5 w-fit border border-gray-300 bg-gradient-to-r from-black/10 to-black/0">
              工作者
            </button>
            <h2 className="text-[1.5rem]">释放你的专业音频技能</h2>
            <h3 className="text-lg">通过弹性工作机会实现技能价值</h3>
            <button className="flex items-center px-4 py-2 rounded-lg w-fit bg-black text-white">
              认证
              <ArrowIcon className="text-white" />
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-[120px] py-20">
          <SectionTitle>选择音合</SectionTitle>
          <div className="flex border-y border-[#cdcdcd]">
            <FeatureCard
              icon="1.gif"
              title="歌手、乐队、配音等多种类技能者聚集地"
              description="各类风格，完善的实录条件与能力，提供您最需要的声音。"
              gifSize={58}
            />
            <RightBorderDecoration />
            <FeatureCard
              icon="2.gif"
              title="作词、作曲、音视频设计创作等"
              description="创意、创作、创造！无须多言！一起碰撞思维的火花！"
              gifSize={52}
            />
            <RightBorderDecoration />
            <FeatureCard
              icon="3.gif"
              title="歌曲贴唱、音视频分轨混音、对白、母带"
              description="按需匹配的一切音视频相关混音、后期。"
              gifSize={48}
            />
            <RightBorderDecoration />
            <FeatureCard
              icon="4.gif"
              title="硬件帮助"
              description="为设备护航，调试专家们远程帮你解决设备问题。"
              gifSize={48}
            />
          </div>
        </section>

        {/* Process Section */}
        <section className="px-[120px]">
          <SectionTitle>简单便捷</SectionTitle>
          <div className="flex gap-6">
            <ProcessCard
              title="发现"
              description="浏览工作者详情，选择心仪合作方。"
              image="ad1.png"
            />
            <ProcessCard
              title="沟通"
              description="确认需求细节，达成合作共识。"
              image="ad2.png"
            />
            <ProcessCard
              title="确认"
              description="按时交付满意作品，完成订单。"
              image="ad3.png"
            />
          </div>
        </section>

        {/* Trust Section */}
        <section className="p-[120px]">
          <SectionTitle>值得信赖的专业服务</SectionTitle>
          <div className="flex gap-10 my-10 justify-center">
            <TrustCard
              icon="5.gif"
              title="快速免费"
              description="免费发布需求，最短时间获得响应"
            />
            <TrustCard
              icon="6.gif"
              title="专业认证"
              description="所有工作者均通过技能资质审核"
            />
          </div>
          <div className="flex gap-10 my-10">
            <TrustCard
              icon="7.gif"
              title="安全隐私"
              description="可设置需求隐藏，仅对邀请人才可见"
            />
            <TrustCard
              icon="8.gif"
              title="进度管理"
              description="通过日历跟踪订单全流程进度，实时更新最新动态"
            />
            <TrustCard
              icon="9.png"
              title="商业支持"
              description="可提供合同签署、发票开具、版权授权等服务"
            />
          </div>
        </section>

        {/* Workflow Section */}
        <section className="px-[120px] text-center">
          <SectionTitle>完善的工作流程</SectionTitle>
          <div>
            <div className="flex justify-center w-[32rem] mx-auto gap-10">
              <WorkflowButton icon="s.png">个人方案</WorkflowButton>
              <WorkflowButton icon="s.png">商业项目</WorkflowButton>
              <WorkflowButton icon="s.png">团队协作</WorkflowButton>
            </div>
            <div className="flex justify-center w-3/5 mx-auto my-6">
              <Image
                src="/images/landing_page/line.png"
                alt="Decoration"
                width={600}
                height={2}
                className="w-3/5 mx-auto"
              />
            </div>
          </div>

          {/* Profile Card */}
          <div className="w-[30em] mx-auto border border-[#d5d5d5] rounded-2xl p-10">
            <div className="border border-[#d5d5d5] rounded-lg p-4 mb-4 relative">
              <div className="flex items-start">
                <Image
                  src="/images/landing_page/james.png"
                  alt="avatar"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div className="ml-3">
                  <div className="flex items-center">
                    <span className="text-sm">音合</span>
                    <svg className="ml-1 w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M11.4416 2.92501L12.9083 5.85835C13.1083 6.26668 13.6416 6.65835 14.0916 6.73335L16.7499 7.17501C18.4499 7.45835 18.8499 8.69168 17.6249 9.90835L15.5583 11.975C15.2083 12.325 15.0166 13 15.1249 13.4833L15.7166 16.0417C16.1833 18.0667 15.1083 18.85 13.3166 17.7917L10.8249 16.3167C10.3749 16.05 9.63326 16.05 9.17492 16.3167L6.68326 17.7917C4.89992 18.85 3.81659 18.0583 4.28326 16.0417L4.87492 13.4833C4.98326 13 4.79159 12.325 4.44159 11.975L2.37492 9.90835C1.15826 8.69168 1.54992 7.45835 3.24992 7.17501L5.90826 6.73335C6.34992 6.65835 6.88326 6.26668 7.08326 5.85835L8.54992 2.92501C9.34992 1.33335 10.6499 1.33335 11.4416 2.92501Z"
                        fill="#ff9"
                        stroke="#dd8"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="ml-1">4.9 (125)</span>
                  </div>
                  <span className="block py-1.5">Artist</span>
                </div>
                <Image
                  src="/images/landing_page/heart.png"
                  alt="heart"
                  width={32}
                  height={32}
                  className="absolute top-2.5 right-1"
                />
              </div>
              <div className="flex gap-1 mt-2">
                {['Mixing', 'Singing', 'Jazz', 'Rap'].map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </div>
            <div className="relative overflow-visible">
              <Image
                src="/images/landing_page/pattern1.png"
                alt="Pattern"
                width={992}
                height={400}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="w-3/5 mx-auto mb-[120px]">
            <Image
              src="/images/landing_page/pattern2.png"
              alt="Pattern"
              width={992}
              height={400}
              className="mb-6"
            />
            <div className="flex">
              <div className="w-1/5">
                <h4 className="text-[1rem] mb-2 font-bold">服务支持</h4>
                <div className="text-[14px]">工作日9:30–22:00人工客服在线<br />法定节假日除外</div>
              </div>
              <div className="w-3/5">
                <h4 className="text-[1rem] mb-2 font-bold">保密协议</h4>
                <div className="text-[14px]">未经授权,<br />工作者不得泄露订单相关信息</div>
              </div>
              <div className="w-1/5">
                <h4 className="text-[1rem] mb-2 font-bold">服务保障</h4>
                <div className="text-[14px]">交付订单时,<br />作品交付不符合要求可申请退款。</div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
